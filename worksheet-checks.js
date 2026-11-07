// Each entry follows the printed order. An empty row is a drawing or explanation.
const worksheetChecks = [
[
'A Kästchen=20;B Kästchen=21',
'a) Quadrate je Reihe=6;b) Reihen=4;c) Quadrate=24;e) Quadrate=21',
'b) Länge in Kästchen=6;b) Höhe in Kästchen=4;c) Fläche in Kästchen=24',
'','Fläche jeder Figur in Kästchen=12'
],[
'a) cm²=20;b) m²=42;c) cm²=13.5;d) mm²=40.5;e) cm²=180',
'a) cm²=32;b) m²=18;c) cm²=55;d) m²=0.7',
'a) cm²=30;b) cm²=14;c) m²=0.48',
'a) Kästchen=12;b) Kästchen=8;c) Kästchen=20;d) Kästchen=18',
'a) Höhe in cm=6;b) Grundseite in m=12;c) Höhe in cm=4;d) Grundseite in cm=20',
'a) h in cm=5;b) c in m=8;c) a in cm=9;d) h in cm=6',
'a) f in cm=6;b) e in cm=15',
'a) A in cm²=30;a) hᵦ in cm=7.5;b) A in cm²=24;b) Höhe auf die Hypotenuse in cm=4.8;c) b in cm=6',
'a) m²=30.8;b) Kessel=2','a) m²=585;b) Franken=204750',
'a) cm²=2700;b) cm² mit Verschnitt=2970','',
'a) cm²=18;b) cm²=18','Fläche in cm²=18',
'a) Faktor=2;b) Faktor=4;c) Faktor=2;d) Faktor=1',
'a) cm²=30','a in cm=12;c in cm=6','Anzahl ganzzahliger Paare=10','','a) m²=43.5;b) m²=43.5'
],[
'a) cm²=40;a) Umfang in cm=26;b) m²=84;b) Umfang in m=38;c) cm²=9;c) Umfang in cm=13;d) dm²=3;d) Umfang in dm=7.4;e) mm²=225;e) Umfang in mm=60',
'a) cm²=24;b) m²=31.5;c) cm²=90;d) dm²=3.6;e) m²=0.2',
'a) a=5;a) Höhe=3;a) Fläche=15;b) a=6;b) Höhe=3;b) Fläche=18;c) a=4;c) Höhe=4;c) Fläche=16;d) a=3;d) Höhe=5;d) Fläche=15',
'a) b in cm=6;a) U in cm=30;b) Länge in m=13;b) U in m=38;c) Länge in cm=11;c) cm²=44;d) b in dm=8;d) dm²=96;e) Seite in cm=9;e) U in cm=36',
'a) Höhe in cm=7;b) a in m=6;c) Höhe in cm=4;d) a in m=0.5',
'a) cm²=5400;a) m²=0.54;b) cm²=240;b) dm²=2.4;c) m²=0.7',
'a) A in cm²=48;a) hᵦ in cm=8;b) A in cm²=72;b) hₐ in cm=6',
'a) Franken=604.8;b) Franken=87','a) m²=18;b) m²=222',
'Grösste Fläche in cm²=36','a) Faktor=2;b) Faktor=4;c) Faktor=1;d) Faktor=1.5',
'a) Plättli=144;b) Packungen=15','a) cm²=42;b) cm²=42','Rahmenfläche in cm²=464',
'Länge in cm=10;Breite in cm=7;Fläche in cm²=70',
'a) grösste Fläche in cm²=40;b) Höhe in cm=2.5','',
'b) cm²=24;c) Höhe in cm=4.8','a) f in cm=5;b) e in cm=12;c) e in cm=4;c) f in cm=8',
'a) exakte Fläche in cm²=36;b) cm²=50',
'a) längere Diagonale in cm=10;a) kürzere Diagonale in cm=6;b) cm²=30',
'a) cm²=24;b) cm²=24;c) cm²=25','a) cm²=24'
],[
'a) cm³=120;b) dm³=100;c) cm³=216;d) m³=0.48;d) Liter=480',
'a) cm³=3500;b) Liter=2.5;c) Liter=1200;d) cm³=750;e) dm³=40',
'a) G in cm²=12;a) V in cm³=120;b) G in cm²=40;b) V in cm³=240;c) G in cm²=20;c) V in cm³=180;d) G in cm²=30;d) V in cm³=360;e) G in dm²=20;e) V in dm³=300','',
'a) m²=1.5;b) m³=3.75','a) m²=2.7;b) m³=270',
'a) cm=6;b) cm=4;c) cm=5;d) cm=6;e) cm=12',
'b) cm³=240','a) Liter=98;b) Wege=10',
'a) m²=50;b) m³=500;b) Liter=500000;c) Minuten=2000',
'Volumen in m³=216','a) cm³=240','a) dm³=48;b) kg=28.8',
'a) Faktor=2;b) Faktor=8;c) Faktor=4;d) Faktor=3',
'Volumen in cm³=600','','a) Kante in cm=3;a) cm³=27;b) drei rote Flächen=8;b) zwei rote Flächen=12;b) eine rote Fläche=6;b) keine rote Fläche=1;c) drei rote Flächen=8;c) zwei rote Flächen=24;c) eine rote Fläche=24;c) keine rote Fläche=8'
]];
