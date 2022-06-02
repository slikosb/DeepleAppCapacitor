import { Component, ChangeDetectorRef } from '@angular/core';
import { DeeplService } from '../Service/Data.service';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  targetLanguage : string = "FR"
  sourceLanguage : string = "FR"
  isSpeechAvailable = false;
  isListening = false;
  matches: Array<string> = [];
  

  constructor(private apiDeepl: DeeplService, private platform: Platform, private changeDetectorRef: ChangeDetectorRef, private speechRecognition: SpeechRecognition) {

    platform.ready().then(() => {
      this.speechRecognition.isRecognitionAvailable()
      .then((available: boolean) => this.isSpeechAvailable = available)
    })

  }

  ngOnInit(){}

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

  public startListening(): void{
    this.isListening = true;
    this.matches = [];
    let options = {
      language: 'fr-FR',
      matches: 5,
      prompt: 'Je vous écoute ! :)',      // Android only
      showPopup: true,  // Android only
      showPartial: false 
    }

    this.speechRecognition.startListening(options)
    .subscribe(
      (matches: string[]) => {
        this.isListening = false;
        this.matches = matches;
        this.changeDetectorRef.detectChanges();
      },
      (onerror) => {
        this.isListening = false;
        this.changeDetectorRef.detectChanges();
        console.log(onerror);
      }
    )
  }
  
  public stopListening(): void{
    this.speechRecognition.stopListening();
  }
}
