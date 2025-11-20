import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import fondo from "../assets/fondo.jpg";
import qr from "../assets/qr.png"; // reemplaza con tu QR real

// =========================================
//        FUNCTION PARA NUMEROS LITERALES
// =========================================
function numeroALiteral(num) {
  const unidades = ['','UNO','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE'];
  const decenas = ['','DIEZ','VEINTE','TREINTA','CUARENTA','CINCUENTA','SESENTA','SETENTA','OCHENTA','NOVENTA'];
  const especiales = {
    11:'ONCE',12:'DOCE',13:'TRECE',14:'CATORCE',15:'QUINCE',
    16:'DIECISÉIS',17:'DIECISIETE',18:'DIECIOCHO',19:'DIECINUEVE'
  };

  function convertirCentenas(n) {
    if (n >= 100) {
      if (n === 100) return "CIEN";
      const centenas = ['','CIENTO','DOSCIENTOS','TRESCIENTOS','CUATROCIENTOS','QUINIENTOS','SEISCIENTOS','SETECIENTOS','OCHOCIENTOS','NOVECIENTOS'];
      return `${centenas[Math.floor(n/100)]} ${convertirDecenas(n % 100)}`.trim();
    }
    return convertirDecenas(n);
  }

  function convertirDecenas(n) {
    if (n < 10) return unidades[n];
    if (especiales[n]) return especiales[n];
    if (n < 100) {
      const d = Math.floor(n/10);
      const u = n % 10;
      return u === 0 ? decenas[d] : `${decenas[d]} Y ${unidades[u]}`;
    }
    return '';
  }

  function convertirMiles(n) {
    if (n < 1000) return convertirCentenas(n);
    if (n < 1_000_000) {
      const miles = Math.floor(n/1000);
      const resto = n % 1000;
      return `${miles === 1 ? "MIL" : convertirCentenas(miles) + " MIL"} ${convertirCentenas(resto)}`.trim();
    }
    return "NÚMERO MUY GRANDE";
  }

  // separar enteros y decimales
  const entero = Math.floor(num);
  const decimal = Math.round((num - entero) * 100);

  const literalEntero = convertirMiles(entero);
  const literalDecimal = decimal.toString().padStart(2, "0");

  return `${literalEntero} ${literalDecimal}/100 BOLIVIANOS`;
}



export default function FacturaPDF({ cliente, onBack }) {
  const [notaValor, setNotaValor] = useState([]);
  const [tribA, setTribA] = useState([]);
  const [tribB, setTribB] = useState([]);
  const [tribC, setTribC] = useState([]);
  const [cotizacion, setCotizacion] = useState(null);
  


  useEffect(() => {
    fetch("http://localhost:3001/notaValor")
      .then(res => res.json())
      .then(data => setNotaValor(data));

    fetch("http://localhost:3001/tribA")
      .then(res => res.json())
      .then(data => setTribA(data));

    fetch("http://localhost:3001/tribB")
      .then(res => res.json())
      .then(data => setTribB(data));

    fetch("http://localhost:3001/tribC")
      .then(res => res.json())
      .then(data => setTribC(data));

    fetch("http://localhost:3001/cotizacion")
      .then(res => res.json())
      .then(data => setCotizacion(data[0]));
  }, []);

  const styles = StyleSheet.create({
    // page: { padding: 0, fontSize: 11, fontFamily: "Helvetica" },
    // container: { width: "100%", height: "100%", position: "relative" },
    // bgImage: { width: "100%", height: "100%", position: "absolute", opacity: 0.5 },
    // content: { position: "absolute", top: 20, left: 25, right: 25 },
    // title: { textAlign: "center", fontSize: 25, marginBottom: 10, fontWeight: "bold", paddingTop: 50 },
    // tableRow: { flexDirection: "row", justifyContent: "flex-start", marginBottom: 4 },
    // line: { borderBottomWidth: 1, borderBottomColor: "#000" },
    // sectionTitle: { fontSize: 12, marginTop: 12, marginBottom: 4, fontWeight: "bold" },
    // subTitle: { fontSize: 12, marginTop: 5, marginBottom: 2, fontWeight: "bold" },
    // smallText: { fontSize: 10 },
    // lefText: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
    // subTotal: { flexDirection: "row", justifyContent: "space-between", fontWeight: "bold", marginVertical: 2 },
    // footer: { marginTop: 20, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f8f5f5ff", paddingTop: 5 }
    page: {
      padding: 0,
      fontSize: 11,
      fontFamily: "Helvetica",
    },
    container: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
    bgImage: {
      width: "100%",
      height: "100%",
      position: "absolute",
      opacity: 0.50,
    },
    content: {
      position: "absolute",
      top: 20,
      left: 25,
      right: 25,
    },
    title: {
      textAlign: "center",
      fontSize: 25,
      marginBottom: 10,
      fontWeight: "bold",
      paddingTop: 50,

    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
    },
    tableRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 4,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: "#000",
    },
    lineH: { 
      width: 1, 
      backgroundColor: "#000", 
      marginHorizontal: 10 
    },
    sectionTitle: {
      fontSize: 12,
      marginTop: 12,
      marginBottom: 4,
      fontWeight: "bold",
    },
    subTitle: {
      fontSize: 12,
      marginTop: 5,
      marginBottom: 2,
      fontWeight: "bold",
    },
    smallText: {
      fontSize: 10,
    },
    lefText: {
      fontSize: 10,
      flexDirection: "row", 
      justifyContent: "space-between",
    },
    subTotal: {
      fontSize: 10,
      flexDirection: "row", 
      justifyContent: "space-between",
      fontWeight: "bold",
      paddingTop:10,
    },

    footer: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor:"#f8f5f5ff",
      paddingTop: 5,
    }
  });
  

  const dynamic = cliente || { nit: "48651321", nombre: "PRUEBA 2" };

  // Calcular totales
  const total = notaValor.reduce((acc, item) => acc + parseFloat(item.description), 0);
  const totalTribA = tribA.reduce((acc, item) => {
    const clean = parseFloat((item.description || "0").replace(/,/g, ""));
    return acc + (isNaN(clean) ? 0 : clean);
  }, 0);

  const totalTribB = tribB.reduce((acc, item) => acc + parseFloat(item.description), 0);
  const totalTribC = tribC.reduce((acc, item) => acc + parseFloat(item.description), 0);
  const tc = 6.96;
  const totalBS = total * tc;
  const totalCotizacion = (totalTribA + totalTribB + totalTribC);
  const literalTotal = numeroALiteral(totalCotizacion);

  return (
    <div style={{ height: "100vh" }}>
      <button onClick={onBack}>◀ Volver</button>

      <PDFViewer width="100%" height="95%">
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.container}>
              <Image src={fondo} style={styles.bgImage} />
              <View style={styles.content}>
                <Text style={styles.title}>COTIZACIÓN - PROFORMA</Text>

                <View style={styles.tableRow}>
                  <View style={{ flex: 1 }}></View>
                  <View>
                    <Text style={styles.sectionTitle}>2025 - 0625</Text>
                    <Text style={styles.smallText}>La Paz, 29 de Octubre de 2025</Text>
                  </View>
                </View>

                <View style={styles.line} />
                <View style={styles.tableRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subTitle}>NIT:</Text>
                    <Text>{dynamic.nit}</Text>
                  </View>
                  <View style={{ flex: 5 }}>
                    <Text style={styles.subTitle}>Importador/Exportador:</Text>
                    <Text>{dynamic.nombre}</Text>
                  </View>
                </View>

                <View style={styles.line} />

                {/* Bloque Valores */}
                <View style={styles.tableRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", paddingTop: 5, marginBottom: 5 }}>
                      Valor CIF Frontera
                    </Text>

                    {/* Notas de valor dinámicas */}
                    {notaValor.map(item => (
                      <View style={styles.tableRow} key={item.id}>
                        <View style={{ flex: 3 }}>
                          <Text>{item.label}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text>$us</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                          <Text>{item.description}</Text>
                        </View>
                      </View>
                    ))}

                    {/* Totales */}
                    <View style={{ flexDirection: "row", paddingTop: 5, height: 20, backgroundColor: "#a6a4a4ff", fontWeight: "bold" }}>
                      <View style={{ flex: 3 }}>
                        <Text>VALOR CIF</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text>$us</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Text>{total.toFixed(2)}</Text>
                      </View>
                    </View>

                    <Text style={{ paddingTop: 5, textAlign: "center", marginBottom: 5 }}>TC {tc}</Text>

                    <View style={{ flexDirection: "row", paddingTop: 5, height: 20, backgroundColor: "#a6a4a4ff", fontWeight: "bold" }}>
                      <View style={{ flex: 3 }}>
                        <Text>VALOR CIF</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text>Bs.</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Text>{totalBS.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.lineH} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subTitle}>Descripción de las Mercancias</Text>
                    <Text>{cotizacion?.descripcionDeLaMercancia || "ACCESORIOS ELECTRONICOS"}</Text>

                    <Text style={styles.subTitle}>Factura Comercial</Text>
                    <Text>1200 AMPER USA LLC</Text>

                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle}>bultos</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "flex-end", paddingTop: 5 }}>
                        <Text>{cotizacion?.bultos || "00"}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle}>Peso</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Text style={{ paddingTop: 5 }}>{cotizacion?.peso || "00"}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.subTitle}>Aduana </Text>
                      <Text style={{ paddingTop: 5 }}>{cotizacion?.aduanaDespacho || "205 interior"}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.subTitle}>Modalidad </Text>
                      <Text style={{ paddingTop: 5 }}>{cotizacion?.regimen || "205 interior"}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", paddingTop: 5,height: 20,backgroundColor: "#a6a4a4ff", color: "#fff",fontWeight: "bold", textAlign:"center" }}>
                  <View style={{ flex: 2 }}>
                    <Text>Concepto</Text>
                  </View>
                  <View style={styles.lineH}  />
                  <View style={{ flex: 1 }}>
                    <Text>Monto</Text>
                  </View>
                </View>

                {/* Tributos */}
                {/* <View style={styles.line} /> */}

                <Text style={styles.sectionTitle}>TRIBUTOS ADUANEROS</Text>
                {[...tribA].map(item => (
                  <View style={styles.lefText} key={item.id}>
                    <Text>{item.label}</Text>
                    <Text>{item.description}</Text>
                  </View>
                ))}
                <View style={styles.subTotal}>
                  <Text>Sub Total</Text>
                  <Text>{(totalTribA).toFixed(2)}</Text>
                </View>

                <View style={styles.line} />

                <Text style={styles.sectionTitle}>GASTOS DE OPERACION</Text>
                {[...tribB].map(item => (
                  <View style={styles.lefText} key={item.id}>
                    <Text>{item.label}</Text>
                    <Text>{item.description}</Text>
                  </View>
                ))}
                <View style={styles.subTotal}>
                  <Text>Sub Total</Text>
                  <Text>{(totalTribB).toFixed(2)}</Text>
                </View>

                <View style={styles.line} />

                <Text style={styles.sectionTitle}>SERVICIOS DE AGENCIA</Text>
                {[...tribC].map(item => (
                  <View style={styles.lefText} key={item.id}>
                    <Text>{item.label}</Text>
                    <Text>{item.description}</Text>
                  </View>
                ))}
                <View style={styles.subTotal}>
                  <Text>Sub Total</Text>
                  <Text>{(totalTribC).toFixed(2)}</Text>
                </View>

                <View style={styles.line} />

                <View style={styles.subTotal}><Text>TOTAL COTIZACIÓN</Text><Text>{(totalCotizacion).toFixed(2)}</Text></View>
                
                <View style={{ paddingTop: 10 }}>
                  <Text>SON: {literalTotal}</Text>
                </View>

                
                <Text>Válido por 7 días</Text>

                <View style={styles.footer}>
                  <View style={{ flex: 1, textAlign:"center" }}>
                    <Text style={{ marginBottom:"10" }}>UBICACIÓN:</Text>
                    <Text style={{ fontSize: 8, }}>AV. 16 DE JULIO, EDIFICIO HERMANN, PISO 18</Text>
                    <Text style={{ fontSize: 8, }}>DPTO A NRO.1440 - TELEFONO: 2409866 - </Text>
                    <Text style={{ fontSize: 8, }}>2406093 FAX:(591+2) 2407490</Text>
                    <Text style={{ fontSize: 8, }}>LA PAZ - BOLIVIA</Text>
                  </View>

                  <View style={{ flex: 1, textAlign:"center" }}>
                    <Text style={{ marginBottom:"10" }}>BANCO UNION S.A.</Text>
                    <Text style={styles.smallText}>NÚMERO DE CUENTA:</Text>
                    <Text style={styles.smallText}>CTA. BS.: 10000029719230</Text>
                  </View>

                  <View style={{ flex: 1, textAlign:"center" }}>
                    <Text style={{ marginBottom:"10" }}>BENEFICIARIO:</Text>
                    <Text style={styles.smallText}>A.D.A. PATROSS S.R.L.</Text>
                    <Text style={styles.smallText}>(591) 76504040</Text>
                  </View>
                  
                </View>
                <View style={{ marginLeft: "25%" }}>
                    <Image src={qr} style={{ width: 90, height: 90 }} />
                </View>

              </View>

            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}
