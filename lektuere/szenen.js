// Die Bilder sind freie Illustrationen. Die Abschnittsnummern folgen der EPUB-Lesereihenfolge.
const bildFolge = [
 [4,'Die unterbrochene Mathearbeit','Prüfungsbogen mit Bleistift und Lineal'],
 [13,'An der Klassenzimmertür','Türgriff im Schatten'],
 [19,'Der Blick nach draussen','Regen an einem Schulfenster'],
 [23,'Die Nachricht an der Tafel','Stift vor einer abgewischten Tafel'],
 [29,'Der erste Umschlag','Verschlossene Umschläge auf dem Pult'],
 [36,'Vor den Augen der Klasse','Zwei Pullover auf Stühlen'],
 [48,'Wer schaut hin?','Umgedrehter Handspiegel auf einem Tisch'],
 [56,'Die geleerten Taschen','Portemonnaie in einer Hosentasche'],
 [71,'Jills Stimme','Kopfhörer auf einem Schulstuhl'],
 [82,'Fillers Arbeit','Laptop in einer Lehrertasche'],
 [86,'Fionas Blick auf Sylvester','Zwei Schatten im Klassenzimmer'],
 [100,'Feuer und Wasser','Trinkflasche neben dem Waschbecken'],
 [108,'Hugo','Skelettmodell im Klassenzimmer'],
 [128,'Die Klasse greift ein','Schülerinnen und Schüler im Gegenlicht'],
 [132,'Der letzte Brief','Gefaltetes Papier neben einem Ärmel'],
 [134,'Draussen','Zelte auf einem Schulhof']
];
const zusatz = {
3:'Die Unterbrechung kommt Mark zunächst gelegen: Bei der dritten Aufgabe schaut er zu Sylvester, den er Knallermann nennt. Als Filler seinen Namen ruft, rechnet Mark damit, beim Abschreiben erwischt worden zu sein.',
7:'Mark öffnet, nachdem die Stimme eines Kindes um Einlass gebeten hat. Fiona hat ihn darin bestärkt. Von ihrem Platz aus konnte sie vorher nur hören, wer draussen sein könnte.',
13:'Mark hofft für einen Augenblick, die bewaffnete Person werde von selbst wieder gehen. Das Verrammeln der Tür macht diese Hoffnung zunichte.',
19:'Mit den Handys gehen auch private Erinnerungen verloren. Fiona denkt an die Fotos ihres Hundes Safran. Die Geräusche vom Hof lassen sie dann auf Hilfe hoffen.',
30:'Die Erleichterung gehört zu Fillers Innenperspektive. Für Tamara und Jan beginnt gerade eine öffentliche Demütigung.',
41:'Fiona wendet sich direkt an ihr Gegenüber und erklärt ihre Vorgeschichte mit Ida-Sophie. Damit lenkt sie auch, wie wir ihr eigenes Lachen beurteilen.',
45:'Fabio schlägt zu und versucht, die bewaffnete Person zu überwältigen. Ein Schuss trifft seine Hand. Das kleine Mädchen vergräbt den Kopf zwischen den Knien.',
52:'Fabio erkennt die SIM-Karte seines Tablets. Dadurch wird aus dem Verdacht eine konkrete Anschuldigung gegen Lasse.',
53:'Filler erinnert sich an Geld, das beim Sport aus den Umkleiden verschwand. Damals hatte Aline berichtet, sie habe ihr Handy in einer fremden Schultasche gefunden. Filler war von seiner eigenen Ermittlung überzeugt.',
55:'Sylvester erinnert sich ans Training, Luca an seine verschwundenen Schuhe. Lasse schaut an Filler vorbei zur bewaffneten Person. Woher kennt sie diese Geheimnisse?',
66:'Während Jill isst, fallen Fiona ihre zitternden Hände auf. Erst Gretas Vermutung lässt Fiona frühere Beobachtungen neu verbinden: Jills Fehlen und ihren Abstand in der Mensa.',
73:'Für Filler hängt an der Doktorarbeit die erhoffte Anerkennung. Dass der Auftrag den richtigen Gegenstand trifft, wirft für ihn die Frage auf, wer seinen Alltag so genau kennt.',
86:'Fiona hatte Sylvester bewundert. Aus nächster Nähe merkt sie, wie wenig ihr früheres Wunschbild mit diesem erzwungenen Augenblick zu tun hat.',
93:'Während Filler den Konflikt gedanklich auf zwei Möglichkeiten verengt, zögert Fiona und greift dann nach den Klausurbögen. Ein Aufgabenblatt fällt zu Boden.',
100:'Das Kind gibt Mark den entscheidenden Hinweis zum Löschen. Danach fordert Fiona Aline auf, ihre verletzte Hand zu kühlen.',
103:'Hugo ist ein Plastikskelett aus Fillers Geschichtsunterricht. Die Klasse durfte es als Steinzeitmenschen ausstatten. Was später zerstört wird, hat sie früher gemeinsam gestaltet.',
113:'Fiona will Mark von einem Angriff auf Sylvester abhalten. Mark beschreibt, was ihr Blick in ihm auslöst. Ob er ihre Absicht genau verstanden hat, bleibt an dieser Stelle offen.',
118:'Filler deutet den misslungenen Wurf mit einem Vorurteil über Mädchen. Seine Wertung zeigt seine Sichtweise; das beobachtbare Ereignis ist, dass die Pistole ihr Ziel verfehlt.',
125:'Die frühere Sitznachbarin hatte die Schule etwa ein halbes Jahr zuvor verlassen. Mark erkennt sie und zögert trotzdem, ihren Namen zu nennen.',
126:'Sie hatte Filler von ihrem Unwohlsein in der Klasse erzählt und von ihrem Wunsch, in der Altenpflege zu arbeiten. Rückblickend wirkt seine damalige Antwort auf ihn unzureichend.',
131:'Beckie beschreibt, wie sie die Klasse beobachtet hat. Sie widerspricht dem Diebstahlsvorwurf, erinnert Filler an ihr Vertrauen und deutet einen schweren Übergriff an, bei dem sie Sylvester, Luca und Fabio anspricht. Sie wirft der Klasse Wegsehen vor und räumt zugleich ein, dass auch sie keinen klaren Blick mehr hatte. Ihren Eltern sagt sie ausdrücklich, dass sie für ihre Tat keine Verantwortung tragen.',
134:'Der Epilog greift die gemeinsame Anrede aus dem Prolog wieder auf. Nach den vielen einzelnen Ich-Stimmen sprechen die Erzählenden noch einmal gemeinsam über die Schwierigkeit des Erzählens.'
};
function bildIndex(n){return bildFolge.findIndex(([bis])=>n<=bis)}
function szenenBild(n){
 const i=bildIndex(n),motiv=bildFolge[i];
 return '<div class="romanbild" role="img" aria-label="Illustration: '+motiv[2]+'" style="background-position:'+((i%4)*100/3)+'% '+(Math.floor(i/4)*100/3)+'%"></div>';
}
function rueckblick(n){
 const i=bildIndex(n),anfang=i?bildFolge[i-1][0]+1:1;
 return '<details class="rueckblick"><summary>Szene und Vorgeschichte bis Abschnitt '+n+'</summary>'+szenenBild(n)+'<h3>'+bildFolge[i][1]+'</h3>'+kapitel.slice(Math.max(0,anfang-2),n).map(c=>'<p><b>'+c.n+' · '+c.name+'</b><br>'+c.note+' '+detailfragen[c.n-1][1]+(zusatz[c.n]?' '+zusatz[c.n]:'')+'</p>').join('')+'</details>';
}
