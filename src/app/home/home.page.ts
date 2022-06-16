import { Component, ChangeDetectorRef } from '@angular/core';
import { DeeplService } from '../Service/Data.service';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { Platform } from '@ionic/angular';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  targetLanguage : string = "FR"  //valeur de base en français
  sourceLanguage : string = "FR"  //valeur de base en français
  recording = false;  //valeur de base n'écoute pas
  myText = "";  //Text qui se remplace en permanence
  
  value: Array<String> = [];
  lang = "";  //changement de langue pour le text to speech
  flag = "";
  targFlag = "";
  

  // Initialisation de speechRecognition
  constructor(private apiDeepl: DeeplService, private platform: Platform, private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermission();
  }

  // Vérification de la permission d'écouter le micro
  ngOnInit(){
    SpeechRecognition.hasPermission().then((val)=>{
      if(val.permission == false){
        SpeechRecognition.requestPermission();
      }
    })
  }

  // Récupération du text traduit
  async getData(event: any){
    const val: string = event.target.value;

    let responseData = await this.apiDeepl.getTranslation(val, this.targetLanguage, this.sourceLanguage);
    console.log(responseData)

    let el = document.getElementById("outputText");
    el.innerHTML = responseData.translations[0].text
  }

  swap(){
    // Swap de langue
    let temp = this.targetLanguage;
    this.targetLanguage = this.sourceLanguage;
    this.sourceLanguage = temp;

    // Swap des textes
    temp = this.myText
    this.myText = document.getElementById("outputText").innerHTML;
    document.getElementById("outputText").innerHTML = temp;

    //swap des drapeaux
    let temp2 = this.targFlag;
    this.targFlag = this.flag;
    this.flag = temp2;
    
  }
  

  // Setup de la langue visée (traduction)
  setupLanguage(targLanguage: string){
    this.targetLanguage = targLanguage
    console.log("Changed the target language to " + this.targetLanguage);
    console.log("le targLanguage est : " +targLanguage);
    if(targLanguage=="FR"){
      this.lang="fr-FR";
    }else if(targLanguage=="EN"){
      this.lang="en-US";
    }

    this.targFlag = "https://countryflagsapi.com/png/" + this.targetLanguage;



  }


  // Setup de la langue source (celle que nous voulons traduire)
  setupSrcLanguage(srcLanguage: string){
    this.sourceLanguage = srcLanguage
    console.log("Changed the source language to " + this.sourceLanguage);
    this.flag = "https://countryflagsapi.com/png/" + this.sourceLanguage;
  }

  // Demande la permission d'utiliser le micro
  requestPermission(){
    SpeechRecognition.requestPermission().then((val)=>{
      () => console.log("Permission acceptée");
      () => console.log("Permission refusée");
    });
  }

  // Commencer la reconnaissance vocale
  async startListening(){
    const available = await SpeechRecognition.available();

    if(available){
      this.recording = true;

      //test :
      //this.myText = "heloooooooooooooooooooo";

      SpeechRecognition.start({
        language: "fr-FR",
        maxResults: 2,
        prompt: "Dite quelque chose",
        partialResults: true,
        popup: true,
      });

      SpeechRecognition.addListener("partialResults", (data: any) => {
        console.log("partialResults was fired", data.matches);
      });
      

      // récupération des résultats de la reconnaissance vocale mais impossible de les récupérer
     /* 
      SpeechRecognition.addListener('partialResults', (data: any) => {
        console.log("addListener data=" + JSON.stringify(data));

        if(data.value && data.value.length > 0){
          console.log("addListener " +data.value[0]);
          this.myText=data.value[0];
          this.changeDetectorRef.detectChanges();
        }
      });
*/

      // Cette fonction sert à récupérer les langues acceptés
      SpeechRecognition.getSupportedLanguages();
    }
  }
  

  // Arrêter la reconnaissance vocale
  async stopListening(){
    console.log("stopListening");

    this.recording = false;
    await SpeechRecognition.stop();
  }


  // Fonction pour la voix de synthèse
  speakText(){
    TextToSpeech.speak({
      text: document.getElementById("outputText").innerHTML,
      lang: this.lang,
      
    });
  }

  // Fonction pour le boutton servant à copier le text traduit
  copyMessage(val: string){ 
    const selBox = document.createElement('textarea'); 
    selBox.style.position = 'fixed'; 
    selBox.style.left = '0'; 
    selBox.style.top = '0'; 
    selBox.style.opacity = '0'; 
    val = document.getElementById("outputText").innerHTML;
    selBox.value = val;     
    document.body.appendChild(selBox); 
    selBox.focus(); 
    selBox.select(); 
    document.execCommand('copy'); 
    document.body.removeChild(selBox); 
  }
}
