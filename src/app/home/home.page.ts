import { Component, ChangeDetectorRef } from '@angular/core';
import { DeeplService } from '../Service/Data.service';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  targetLanguage : string = "FR"
  sourceLanguage : string = "FR"
  isSpeechAvailable = true;
  isListening = true;
  matches: Array<string> = [];
  

  constructor(private apiDeepl: DeeplService, private platform: Platform, private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.available();
  }

  ngOnInit(){
    SpeechRecognition.hasPermission().then((val)=>{
      if(val.permission == false){
        SpeechRecognition.requestPermission();
      }
    })
  }

  async getData(event: any){

    const val: string = event.target.value;

    let responseData = await this.apiDeepl.getTranslation(val, this.targetLanguage, this.sourceLanguage);
    console.log(responseData)

    let el = document.getElementById("outputText");
    el.innerHTML = responseData.translations[0].text
  }

  setupLanguage(targLanguage: string){
    this.targetLanguage = targLanguage
    console.log("Changed the target language to " + this.targetLanguage);
    
  }

  setupSrcLanguage(srcLanguage: string){
    this.sourceLanguage = srcLanguage
    console.log("Changed the source language to " + this.sourceLanguage);

  }

  requestPermission(){
    SpeechRecognition.requestPermission().then((val)=>{
      () => console.log("Permission acceptée");
      () => console.log("Permission refusée");
    });
  }

  startListening(){
    console.log("test");
    SpeechRecognition.start({
      language: "fr-FR",
      maxResults: 2,
      prompt: "Dite quelque chose",
      partialResults: true,
      popup: true
    },);
  }
  
  stopListening(){
    SpeechRecognition.stop();
  }
}
