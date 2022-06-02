import { HttpClient, HttpContext, HttpHeaders } from "@angular/common/http";
import { Injectable, TRANSLATIONS } from "@angular/core";
import { Translations } from "../Data/DataSearch";

import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition';



@Injectable({
  providedIn: 'root'
})

export class DeeplService{
  private TAG: any
  speechRecognition: any;

    constructor(private http: HttpClient){
      SpeechRecognition.hasPermission().then((hasPermission: boolean) => {
        console.log('Droit d\'utiliser la reconnaissance vocale ? : ' + hasPermission);

        if(!hasPermission){
          this.requestSpeechRecognitionPermission();
        }
        
      })
    }

    getTranslation(text : string, target_lang : string, source_lang : string): Promise<Translations>{

      console.log(`${this.TAG} getTranslation ${TRANSLATIONS}`)     
      return new Promise(resolve => {        
        var myURL = "https://api-free.deepl.com/v2/translate?auth_key=4c5e0852-6ea3-f18c-208d-3cd4901c3a0a:fx"
        myURL += "&text=" + encodeURIComponent(text)
        myURL += "&target_lang=" + target_lang
        myURL += "&source_lang=" + source_lang

        console.log(myURL);
        

        this.http.get(myURL).subscribe(data => {
        
        let json : Translations = data as Translations;
        resolve(json);}, err => {
            console.log(err);
        }); 
    });
    }

    private requestSpeechRecognitionPermission(): void{
      this.speechRecognition.requestPermission()
      .then(
        () => console.log('Granted'),
        () => console.log('Denied')
      )
    }
}