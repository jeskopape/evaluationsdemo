# Evaluationsdemonstration für LLM-generierte BPMN-Modelle

Dieses Projekt dient zur Demonstration des im Rahmen der Abschlussarbeit entwickelten Evaluationsframeworks von LLM-generierten BPMN-Modellen. 
Die Implementierung zeigt die Funktionalität des Frameworks mit dem beigelieferten BPMN-Modell und der Prozessbeschreibung auf und bietet eine systematische Darstellung des entwickelten Frameworks. 

## Aufbau des Projekts

Das Projekt besteht aus den Folgenden Komponenten: 
- Eingabemaske für das BPMN-Modell und die Prozessbeschreibung
- Syntaktischer Qualitätsanalyse (Visualisierungsmodul, Formaldiagnose und Syntaxkorrektur)
- Semantischer Qualitätsanalyse (Analyse- und Diagnosemodul, Fehlerklassifikation, Semantikkorrektur)
- Die Qualitätsbewertung (Syntaxbewertung, Semantikbewertung und Gesamtqualitätsscore)

## Installation und Start

Ene kurze Einführung in die Installation des Projekts: 
````
$ git clone https://github.com/jeskopape/evaluationsdemo.git
$ cd evaluationsdemo
$ npm install 
$ npm run dev 

Öffne nun die URL http://localhost:3000 im Browser.
````
- Um die Demo nutzen zu können, ist eine .env und ein OpenAI-Key anzulegen. 
- Die XML und die Prozessbeschreibung aus der Demonstration befinden sich im "input"-Ordner.
