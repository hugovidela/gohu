<template>
  <v-row>
    <div></div>
  </v-row>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import moment from 'moment';
import jsPDF from 'jspdf';
export default {
  props: {
    title: String,
    body: String,
    visible: Boolean,
    buttons: Array,
  },
  computed: {
    ...mapState(['sucursal','sucursales','datosEmpresa',]),
  },
  methods: {


    ventasPrint(item, quien) {

      // veo que tipo de comprobante es:
      let tipcpr = ''
      var doc = new jsPDF();
      var img = new Image();
      
      let datos = {
        cpr: null,
        tipcpr: null,
        fecha: null,
        recargo: null,
        sucursal: null,
        sucursales: null,
        emiRazonSocial: null,
        emiDireccion: null,
        emiResponsable: null,
        emiCUIT: null,
        recRazonSocial: null,
        recDireccion: null,
        recResponsable: null,
        recCUIT: null,
        items: null,
        totales: {
          recargo: 0,
          gravado: 0,
          tasadescuento: 0,
          importedescuento: 0,
          excento: 0,
          iva: 0,
          total: 0,
        },
        cancelaciones: [],
        valoresIngresos: [],
        valoresEgresos: [],
        logotipo: null,

      }

      if (quien=='yo') {

        datos.cpr                      = item.cpr,
        datos.tipcpr                   = item.cpr.substr(0,3),
        datos.fecha                    = item.fecha,
        datos.recargo                  = item.recargo,
        datos.sucursal                 = this.sucursal
        datos.sucursales               = this.sucursales
        datos.emiRazonSocial           = this.datosEmpresa.nombre
        datos.emiDireccion             = this.datosEmpresa.direccionNombre
        datos.emiResponsable           = this.datosEmpresa.responsableNombre
        datos.emiCUIT                  = this.datosEmpresa.cuit
        datos.recRazonSocial           = item.tercero.razon_social
        datos.recDireccion             = item.tercero.direcciones[0].direccion+' ('+
                                         item.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.tercero.direcciones[0].postal.provincia.pais.nombre
        datos.recResponsable           = item.tercero.responsable.nombre
        datos.recCUIT                  = item.tercero.cuit
        datos.items                    = item.items
        datos.totales.gravado          = item.gravado,
        datos.totales.tasadescuento    = item.tasadescuento,
        datos.totales.importedescuento = item.importedescuento,
        datos.totales.exento           = item.exento,
        datos.totales.iva              = item.iva,
        datos.totales.total            = item.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
        datos.logotipo                 = item.user.logotipo

      } else {

        datos.cpr                      = item.comprobante.cpr,
        datos.tipcpr                   = item.comprobante.cpr.substr(0,3),
        datos.fecha                    = item.comprobante.fecha,
        datos.recargo                  = item.comprobante.recargo,
        datos.sucursal                 = item.comprobante.sucursal_id
        datos.sucursales               = item.userdesde.sucursales
        datos.emiRazonSocial           = item.userdesde.tercero.razon_social

        datos.emiDireccion             = item.userdesde.tercero.direcciones[0].direccion+' ('+
                                         item.userdesde.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.pais.nombre

        datos.emiResponsable           = item.userdesde.tercero.responsable.nombre
        datos.emiCUIT                  = item.userdesde.tercero.cuit
        datos.recRazonSocial           = item.comprobante.tercero.razon_social

        datos.recDireccion             = item.comprobante.tercero.direcciones[0].direccion+' ('+
                                         item.comprobante.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.pais.nombre
        
        datos.recResponsable           = item.comprobante.tercero.responsable.nombre
        datos.recCUIT                  = item.comprobante.tercero.cuit
        datos.items                    = item.comprobante.items
        datos.totales.gravado          = item.comprobante.gravado,
        datos.totales.tasadescuento    = item.comprobante.tasadescuento,
        datos.totales.importedescuento = item.comprobante.importedescuento,
        datos.totales.exento           = item.comprobante.exento,
        datos.totales.iva              = item.comprobante.iva,
        datos.totales.total            = item.comprobante.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
//      datos.logotipo                 = item.comprobante.tercero.user ? item.comprobante.tercero.user.logotipo : 'SinImagen.jpg'
        datos.logotipo                 = item.userdesde.logotipo

      }

      debugger
      let rangos = []
      let paginas = 0         // lineas por pagina 39, lineas ultima pagina 28
      let des = 0
      let has = 0
      if (datos.items.length<27) {
        rangos.push({desde: 1, hasta: datos.items.length})
      } else {
        paginas = Math.round(datos.items.length/39)
        for (let i=0; i<=paginas-1; i++) {
          des = has + 1;
          if (i==paginas-1) {
            has = datos.items.length
          } else {
            has += 38
          }
          rangos.push({ desde: des, hasta: has })
        }
        // NO ALCANZA A ENTRAR EL PIE, FUERZO A UNA PAGINA NUEVA
        if (rangos[rangos.length-1].hasta-rangos[rangos.length-1].desde>=27) {
          rangos.push({ desde: 0, hasta: 0 }) 
        }
      }

      for (let i=0; i<=rangos.length-1; i++) {
        this.esqueleto(datos, img, doc, quien, rangos, i)
        this.cabecera(datos, doc, rangos, i)
        this.detalles(datos, doc, rangos, i)
      }

      doc.output ('dataurlnewwindow');

    },



    ventasPrintDetalles(item) {
      let tipcpr = item.cpr.substr(0,3)
      var doc = new jsPDF();

      debugger

      if (tipcpr=='FAC' || tipcpr=='NDD' || tipcpr == 'NDC' || tipcpr == 'PRE') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )

        doc.line( 10, 22, 93, 22);
        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Stock?                           Depósito', 10, f ); f +=  10
        doc.text ( 'Total Comprob.                                            TRN', 10, f ); f += 5
        doc.text ( 'Descuento                                                   % Descuento                                  %Recargo', 10, f ); f += 5

        if ([127].indexOf(item.comprobante_id)!=-1) {
          doc.text ( 'Ret.IVA', 10, f ); f += 5
          doc.text ( 'Ret.GAN', 10, f ); f += 5
          doc.text ( 'Ret.IB', 10, f ); f += 5
        }

        doc.text ( 'Gravado                                                       Exento                                            IVA', 10, f );
        f+=10

        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFontStyle("bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                   item.tercero.direcciones[0].postal.codigo+ '-' +
                   item.tercero.direcciones[0].postal.nombre+ ')-' +
                   item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        if (item.regstk==1) {
          doc.text ( 'Sí', 40, f );
        } else {
          doc.text ( 'No', 40, f );
        }
        if (item.deposito_id!=null) {
          doc.text ( item.deposito_id.toString(), 65, f ); f += 10
        }
        doc.text ( '$'+this.formatMoney(item.total), 40, f );
        doc.text ( '$'+this.formatMoney(item.rentabilidad), 105, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.descuento), 40, f );
        doc.text ( '%'+this.formatMoney(item.tasadescuento), 105, f )
        doc.text ( '$'+this.formatMoney(item.recargo), 160, f ); f += 5

        if ([127].indexOf(item.comprobante_id)!=-1) {
          doc.text ( '$'+this.formatMoney(item.retiva), 40, f ); f += 5
          doc.text ( '$'+this.formatMoney(item.retgan), 40, f ); f += 5
          doc.text ( '$'+this.formatMoney(item.retib), 40, f ); f += 5
        }
        doc.text ( '$'+this.formatMoney(item.gravado), 40, f );
        doc.text ( '$'+this.formatMoney(item.exento), 105, f );
        doc.text ( '$'+this.formatMoney(item.iva), 160, f ); f += 5

        doc.setFontStyle("normal");
        doc.setFontSize(8);
        f += 10
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        debugger
        for (let i = 0; i<=item.items.length-1; i++) {
          if (item.items[i].articulo.id===1) {
            doc.text (item.items[i].texto.substring(0,65), 10, f )
          } else {
            doc.text (item.items[i].articulo.codigo, 10, f )
            doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          }
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio), 151, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5

          if (f>280) {
            doc.addPage()
            f = 10
          }

        }
        doc.setFontSize(10);
        f += 5
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'FP        NroValor  Cuenta      Fecha Financiera        Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        doc.setFontSize(8);
        for (let i = 0; i<=item.valoresIngresos.length-1; i++) {
          doc.text (item.valoresIngresos[i].medio_id.toString(), 10, f )
          doc.text (this.formatMoney(item.valoresIngresos[i].importe), 196, f, 'right')
          f += 5
        }

        f += 15
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Pendiente en Cta.Cte.                                        Cancelaciones', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha Vencimiento     Importe                   Pendiente         Fecha      Cpr.Cancelador      Observaciones              Importe', 10, f );
        doc.line( 10, f+2, 93,  f+2);     // linea vertical 1
        doc.line( 100, f+2, 196,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        for (let i = 0; i<=item.pendientes.length-1; i++) {
          fec = moment(item.pendientes[i].vencimiento).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (this.formatMoney(item.pendientes[i].importe), 57, f, 'right')
          doc.text (this.formatMoney(item.pendientes[i].pendiente), 91, f, 'right')
          let totCancelado = 0
          for (let j = 0; j<= item.pendientes[i].cancelaciones.length-1; j++) {
            fec = moment(item.pendientes[i].cancelaciones[j].cancelador.fecha).format('DD/MM/YYYY')
            doc.text (fec, 100, f )
            doc.text (item.pendientes[i].cancelaciones[j].cancelador.cpr, 116, f)
            doc.text (item.pendientes[i].cancelaciones[j].concepto, 147, f)
            doc.text (this.formatMoney(item.pendientes[i].cancelaciones[j].importe), 196, f, 'right')
            totCancelado += item.pendientes[i].cancelaciones[j].importe
            f += 5
          }
          f -= 2
          doc.line( 100, f, 196,  f); f += 5
          doc.text (this.formatMoney(totCancelado), 196, f, 'right')
        }

      } else if (tipcpr=='PED') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Dirección', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Total Pedido', 10, f ); f += 5
        doc.text ( 'Estado', 10, f ); f += 5
        f+=10

        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFontStyle("bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                   item.tercero.direcciones[0].postal.codigo+ '-' +
                   item.tercero.direcciones[0].postal.nombre+ ')-' +
                   item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        if (item.estado=='F') {
          doc.text ( 'Fnalizado', 40, f ); f += 5
        } else if (item.estado=='P') {
          doc.text ( 'Pendiente', 40, f ); f += 5
        } else if (item.estado=='L') {
          doc.text ( 'Facturado Parcialmente', 40, f ); f += 5
        }
        f += 5

        doc.setFontStyle("normal");
        doc.setFontSize(8);
        f += 10
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        for (let i = 0; i<=item.items.length-1; i++) {
          doc.text (item.items[i].articulo.codigo, 10, f )
          doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio), 151, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5
        }
        doc.setFontSize(10);

      } else if (tipcpr=='REC') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Total Recibo', 10, f ); f += 5

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                   item.tercero.direcciones[0].postal.codigo+ '-' +
                   item.tercero.direcciones[0].postal.nombre+ ')-' +
                   item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5

        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        f += 5
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'FP        NroValor  Cuenta      Fecha Financiera        Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        doc.setFontSize(8);
        for (let i = 0; i<=item.valoresIngresos.length-1; i++) {
          doc.text (item.valoresIngresos[i].medio_id.toString(), 10, f )
          doc.text (this.formatMoney(item.valoresIngresos[i].importe), 196, f, 'right')
          f += 5
        }

        f += 15
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Cancelaciones', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha      Cpr.Cancelado       Observaciones              Importe', 10, f );
        doc.line( 10, f+2, 105.5,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        let totCancelado = 0
        for (let i = 0; i<=item.cancelaciones.length-1; i++) {
          fec = moment(item.cancelaciones[i].cancelado.comprobante.fecha).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (item.cancelaciones[i].cancelado.comprobante.cpr, 26, f, 'left')
          doc.text (this.formatMoney(item.cancelaciones[i].importe), 80, f, 'right')
          doc.text (this.formatMoney(item.cancelaciones[i].cancelado.importe), 105, f, 'right')
          totCancelado += item.cancelaciones[i].cancelado.importe
          f += 4
        }
        doc.line( 10, f, 105.5,  f); f += 4
        doc.text (this.formatMoney(totCancelado), 105, f, 'right')

      }

      doc.output ('dataurlnewwindow');

    },


    comprasPrint(item, quien) {

      // veo que tipo de comprobante es:
      debugger
      let tipcpr = ''
      var doc = new jsPDF();
      var img = new Image();
      
      let datos = {
        cpr: null,
        tipcpr: null,
        fecha: null,
        recargo: null,
        sucursal: null,
        sucursales: null,
        emiRazonSocial: null,
        emiDireccion: null,
        emiResponsable: null,
        emiCUIT: null,
        recRazonSocial: null,
        recDireccion: null,
        recResponsable: null,
        recCUIT: null,
        items: null,
        totales: {
          recargo: 0,
          gravado: 0,
          tasadescuento: 0,
          importedescuento: 0,
          excento: 0,
          iva: 0,
          total: 0,
        },
        cancelaciones: [],
        valoresIngresos: [],
        valoresEgresos: [],
        logotipo: null,

      }

      if (quien=='yo') {

        datos.cpr                      = item.cpr,
        datos.tipcpr                   = item.cpr.substr(0,3),
        datos.fecha                    = item.fecha,
        datos.recargo                  = item.recargo,
        datos.sucursal                 = this.sucursal
        datos.sucursales               = this.sucursales
        datos.emiRazonSocial           = this.datosEmpresa.nombre
        datos.emiDireccion             = this.datosEmpresa.direccionNombre
        datos.emiResponsable           = this.datosEmpresa.responsableNombre
        datos.emiCUIT                  = this.datosEmpresa.cuit
        datos.recRazonSocial           = item.tercero.razon_social
        datos.recDireccion             = item.tercero.direcciones[0].direccion+' ('+
                                         item.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.tercero.direcciones[0].postal.provincia.pais.nombre
        datos.recResponsable           = item.tercero.responsable.nombre
        datos.recCUIT                  = item.tercero.cuit
        datos.items                    = item.items
        datos.totales.gravado          = item.gravado,
        datos.totales.tasadescuento    = item.tasadescuento,
        datos.totales.importedescuento = item.importedescuento,
        datos.totales.exento           = item.exento,
        datos.totales.iva              = item.iva,
        datos.totales.total            = item.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
        datos.logotipo                 = item.user.logotipo

      } else {

        datos.cpr                      = item.comprobante.cpr,
        datos.tipcpr                   = item.comprobante.cpr.substr(0,3),
        datos.fecha                    = item.comprobante.fecha,
        datos.recargo                  = item.comprobante.recargo,
        datos.sucursal                 = item.comprobante.sucursal_id
        datos.sucursales               = item.userdesde.sucursales
        datos.emiRazonSocial           = item.userdesde.tercero.razon_social

        datos.emiDireccion             = item.userdesde.tercero.direcciones[0].direccion+' ('+
                                         item.userdesde.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.userdesde.tercero.direcciones[0].postal.provincia.pais.nombre

        datos.emiResponsable           = item.userdesde.tercero.responsable.nombre
        datos.emiCUIT                  = item.userdesde.tercero.cuit
        datos.recRazonSocial           = item.comprobante.tercero.razon_social

        datos.recDireccion             = item.comprobante.tercero.direcciones[0].direccion+' ('+
                                         item.comprobante.tercero.direcciones[0].postal.codigo+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.nombre+ ')-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                                         item.comprobante.tercero.direcciones[0].postal.provincia.pais.nombre
        
        datos.recResponsable           = item.comprobante.tercero.responsable.nombre
        datos.recCUIT                  = item.comprobante.tercero.cuit
        datos.items                    = item.comprobante.items
        datos.totales.gravado          = item.comprobante.gravado,
        datos.totales.tasadescuento    = item.comprobante.tasadescuento,
        datos.totales.importedescuento = item.comprobante.importedescuento,
        datos.totales.exento           = item.comprobante.exento,
        datos.totales.iva              = item.comprobante.iva,
        datos.totales.total            = item.comprobante.total

        datos.cancelaciones            = item.cancelaciones
        datos.valoresIngresos          = item.valoresIngresos
        datos.valoresEgresos           = item.valoresEgresos
        datos.logotipo                 = item.comprobante.tercero.user ? item.comprobante.tercero.user.logotipo : 'SinImagen.jpg'        

      }

      debugger
      let rangos = []
      let paginas = 0         // lineas por pagina 39, lineas ultima pagina 28
      let des = 0
      let has = 0
      if (datos.items.length<27) {
        rangos.push({desde: 1, hasta: datos.items.length})
      } else {
        paginas = Math.round(datos.items.length/39)
        for (let i=0; i<=paginas-1; i++) {
          des = has + 1;
          if (i==paginas-1) {
            has = datos.items.length
          } else {
            has += 38
          }
          rangos.push({ desde: des, hasta: has })
        }
        // NO ALCANZA A ENTRAR EL PIE, FUERZO A UNA PAGINA NUEVA
        if (rangos[rangos.length-1].hasta-rangos[rangos.length-1].desde>=27) {
          rangos.push({ desde: 0, hasta: 0 }) 
        }
      }

      for (let i=0; i<=rangos.length-1; i++) {
        this.esqueleto(datos, img, doc, quien, rangos, i)
        this.cabecera(datos, doc, rangos, i)
        this.detalles(datos, doc, rangos, i)
      }

      doc.output ('dataurlnewwindow');

    },



    comprasPrint2: function(item) {

      debugger
      let tipcpr = item.cpr.substr(0,3)
      var doc = new jsPDF();

      if (tipcpr=='PAG') {

        // LOGO TIPO
        var img = new Image()
        this.cabecera(item, doc)

        doc.setFontStyle("bold");
        doc.setFontSize(14);
        doc.text ( 'ORIGINAL', 93, 16 )
        doc.setFontSize(16);
        doc.text ( 'NOTA DE PAGO', 120, 27 )
        doc.setFontSize(9);
        doc.text ( 'Razón Social:', 15, 50 )
        doc.text ( this.datosEmpresa.razon_social, 38, 50 )
        doc.text ( 'Dirección:', 15, 55 )
        doc.setFontSize(6);
        doc.text ( this.datosEmpresa.direccionNombre, 32, 55 )
        doc.setFontSize(9);
        doc.text ( 'Condicion frente al IVA:', 15, 60 )
        doc.setFontSize(6);
        doc.text ( this.datosEmpresa.responsableNombre, 52, 60 )
        doc.setFontSize(36);
        doc.text ( item.cpr.substring(4,5), 100.5, 32 )
        doc.setFontSize(9);

        doc.setFontStyle("bold");
        doc.text ( 'Punto de Venta', 120, 35 )
        doc.text ( 'Comp. Nro', 157, 35 )
        doc.text ( 'Fecha de Emisión:', 120, 40 )
        doc.text ( 'CUIT', 120, 45 )
        doc.text ( 'Ingresos Brutos', 120, 50 )
        doc.text ( 'Fecha de Inicio de Actividades', 120, 55 )

        doc.setFontStyle("normal");
        doc.text ( item.cpr.substring(6,10), 145, 35 )
        doc.text ( item.cpr.substring(11,19), 175, 35 )
        doc.text ( moment(String(item.fecha)).format('L'), 148, 40 )
        doc.text ( item.tercero.cuit, 129, 45 )
        doc.text ( 'NO', 146, 50 )
        doc.text ( '01/01/2000', 168, 55 )
        doc.text ( 'Detalles del Pago', 15, 72 )
        doc.text ( 'CUIT', 15, 83 )
        doc.text ( 'Condicion de IVA', 15, 89 )
        doc.text ( 'Apellido y Nombre Razón Social', 90, 83 )
        doc.text ( 'Domicilio', 90, 89 )
        
        // pie
        doc.text ( 'TOTAL PAGO', 145, 281 )
        doc.text ( '$'+this.formatoImporte(item.total) ,180, 281 )

        doc.setFontStyle("normal");
        doc.text ( item.tercero.cuit, 24, 83 )
        doc.text ( item.tercero.nombre, 141, 83 )
        doc.text ( item.tercero.responsable.nombre, 43, 89 )
        doc.setFontSize(6);
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                  item.tercero.direcciones[0].postal.codigo+ '-' +
                  item.tercero.direcciones[0].postal.nombre+ ')-' +
                  item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                  item.tercero.direcciones[0].postal.provincia.pais.nombre, 106, 89 )
        doc.setFontSize(9);
        doc.rect(  10,  10, 190,  10);      // segundo rectangulo
        doc.rect(  10,  20, 190,  45);      // primer rectangulo
        doc.rect(  97,  20,  16,  20);      // rectangulo de la letra
        doc.line( 105,40.1, 105,  65);      // linea vertical 1
        doc.rect(  10,  66, 190,  10);      // segundo rectangulo
        doc.rect(  10,  77, 190,  15);      // segundo rectangulo
      //doc.rect(  10, 240, 190,  45);      // rectangulo al pie
        doc.setFontStyle("normal");
        doc.setFontSize(8);

        let headersRes = [
          { title: 'Cpr Cancelado', dataKey:'cpr' }, 
          { title: 'Cancelado', dataKey:'cancelado' } ]
        let headersVal = [
          { title: 'Medio',   dataKey:'abrev' }, 
          { title: 'Banco',   dataKey:'banco' },
          { title: 'Tarjeta', dataKey:'tarjeta' },
          { title: 'NroVal',  dataKey:'nrovalor' },
          { title: 'FecFin',  dataKey:'fechafinanciera' },
          { title: 'Importe', dataKey:'importe' }, ]
        let cancelaciones = []
        let valores = []

        for (let i=0; i<=item.cancelaciones.length-1; i++) {
          cancelaciones.push({ 
            cpr: item.cancelaciones[i].cancelado.comprobante.cpr, 
            cancelado: this.formatoImporte(item.cancelaciones[i].importe) })
        }

        let banco = '' 
        let tarjeta = ''
        for (let i=0; i<=item.valoresEgresos.length-1; i++) {

          if (item.valoresEgresos[i].banco!=null) {
            banco = item.valoresEgresos[i].banco.nombre 
          } else {
            banco = ''
          }

          if (item.valoresEgresos[i].tarjeta!=null) {
            tarjeta = item.valoresEgresos[i].tarjeta.nombre
          } else {
            tarjeta = ''
          }

          valores.push({ 
            abrev: item.valoresEgresos[i].medio.abrev,
            banco: banco,
            tarjeta: tarjeta,
            importe: this.formatoImporte(item.valoresEgresos[i].importe) })
        }

        doc.setFontStyle("bold");
        doc.setFontSize(10);
        doc.text('Cancelaciones', 15, 98)
        doc.setFontStyle("normal");

        const totalPagesExp = '{total_pages_count_string}'
        doc.autoTable(headersRes, cancelaciones, {
          margin: {top: 100, bottom: 25},
          headStyles: { fillColor: [123, 33, 36], fontSize: 6, },
          styles: { fillColor: [236, 233, 223], fontSize: 6, },
          showHeader: true,
          columnStyles: {
            total: { halign: 'right', width: 160, },
            styles: {fillColor: [100, 255, 255], fontSize: 6 },
            columnStyles: { id: {fillColor: 125} },
          },
        });

        var finalY = doc.lastAutoTable.finalY
        doc.setFontStyle("bold");
        doc.setFontSize(10);
        doc.text('Valores Egresados', 15, finalY+5)
        doc.setFontStyle("normal");
        
        doc.autoTable(headersVal, valores, {
          margin: {top: 100, bottom: 25},
          headStyles: { fillColor: [123, 33, 36], fontSize: 6, },
          styles: { fillColor: [236, 233, 223], fontSize: 6, },
          showHeader: true,
          columnStyles: {
            total: { halign: 'right', width: 160, },
            styles: {fillColor: [100, 255, 255], fontSize: 6 },
            columnStyles: { id: {fillColor: 125} },
          },
        });

      } else if (tipcpr=='FAC' || tipcpr=='NDD' || tipcpr=='NDC' || tipcpr=='PED' || tipcpr=='PRE') {

        // LOGO TIPO
        var img = new Image()
        this.cabecera(item, doc)

        doc.setFontSize(8);
        doc.text ( 'gohu', 192, 14 )

        doc.setFontStyle("bold");
        doc.setFontSize(9);
        doc.text ( 'Razón Social:', 15, 50 )
        doc.text ( 'Domicilio:', 15, 55 )
        doc.text ( 'Condicion frente al IVA:', 15, 60 )

        doc.setFontSize(14);
        doc.text ( 'ORIGINAL', 93, 16 )

        doc.setFontSize(16);
        if (tipcpr=='FAC') {
          doc.text ( 'FACTURA', 120, 27 )
        } else if (tipcpr=='NDD') {
          doc.text ( 'NOTA DE DEBITO', 120, 27 )
        } else if (tipcpr=='NDC') {
          doc.text ( 'NOTA DE CREDITO', 120, 27 )
        } else if (tipcpr=='PED') {
          doc.text ( 'PEDIDO', 120, 27 )
        }

        doc.setFontSize(36);
        doc.text ( item.cpr.substring(4,5), 100.5, 32 )

        doc.setFontSize(9);
        doc.text ( 'Punto de Venta', 120, 35 )
        doc.text ( 'Comp. Nro', 157, 35 )
        doc.text ( 'Fecha de Emisión:', 120, 41 )
        doc.text ( 'CUIT', 120, 47 )
        doc.text ( 'Ingresos Brutos', 120, 53 )
        doc.text ( 'Fecha de Inicio de Actividades', 120, 59 )

        doc.setFontStyle("normal");
        doc.text ( item.tercero.nombre, 38, 50 )
        doc.setFontSize(6);
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                  item.tercero.direcciones[0].postal.codigo+ '-' +
                  item.tercero.direcciones[0].postal.nombre+ ')-' +
                  item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                  item.tercero.direcciones[0].postal.provincia.pais.nombre, 32, 55 )

        doc.text ( item.tercero.responsable.nombre, 53, 60 )
        doc.setFontSize(9);

        doc.text ( moment(String(item.fecha)).format('L'), 148, 41 )
        doc.text ( item.cpr.substring(6,10), 145, 35 )
        doc.text ( item.cpr.substring(11,19), 175, 35 )
        doc.text ( item.tercero.cuit, 129, 47 )
        doc.text ( 'NO', 146, 53 )
        doc.text ( '01/01/2000', 168, 59 )

        doc.setFontStyle("bold");
        doc.text ( 'Vencimiento del Comprobante', 15, 72 )

        doc.text ( 'CUIT', 15, 83 )
        doc.text ( 'Condicion de IVA', 15, 89 )
        doc.text ( 'Condicion de Venta', 15, 95 )

        doc.text ( 'Nombre / Razón Social', 90, 83 )
        doc.text ( 'Domicilio', 90, 89 )

        // pie
        doc.text ( 'Observaciones', 13, 250 )
        doc.text ( 'Subtotal', 155, 250 )
        doc.text ( '%Descuento', 155, 255 )
        doc.text ( 'Importe Des', 155, 260 )
        doc.text ( 'Gravado', 155, 265 )
        doc.text ( 'Exento', 155, 270 )
        doc.text ( 'IVA', 155, 275 )
        doc.text ( 'TOTAL', 155, 280 )

        doc.setFontStyle("normal");
        doc.text ( this.datosEmpresa.cuit, 24, 83 )
        doc.text ( this.datosEmpresa.razon_social, 126, 83 )
        doc.text ( this.datosEmpresa.responsableNombre, 43, 89 )
        
        doc.text ( 'CONTADO', 46, 95 )
        
        doc.setFontSize(7);
        doc.text ( this.datosEmpresa.direccionNombre, 106, 89 )
        doc.setFontSize(9);

        doc.rect(  10,  10, 190,  10);     // segundo rectangulo
        doc.rect(  10,  20, 190,  45);     // primer rectangulo
        doc.rect(  97,  20,  16,  20);     // rectangulo de la letra
        doc.line( 105,40.1, 105,  65);     // linea vertical 1
        doc.rect(  10,  66, 190,  10);     // segundo rectangulo
        doc.rect(  10,  77, 190,  25);     // segundo rectangulo
        doc.rect(  10, 245, 190,  40);     // rectangulo al pie

        doc.setFontSize(8);
        doc.setDrawColor(0);
        doc.setFillColor(234, 234, 234);
        doc.rect( 10, 103, 20, 7, 'FD');  //codigo
        doc.rect( 31, 103, 86, 7, 'FD');  //descripcion
        doc.rect(118, 103, 20, 7, 'FD');  //cantidad
        doc.rect(139, 103, 20, 7, 'FD');  //precio
        doc.rect(160, 103, 11, 7, 'FD');  // % Bonif
        doc.rect(172, 103, 28, 7, 'FD');  //TOTAL

        doc.text ( 'Codigo', 12.5, 107.5 )
        doc.text ( 'Descripción', 33.5, 107.5 )
        doc.text ( 'Cantidad', 125.5, 107.5 )
        doc.text ( 'Precio Unit.', 143.5, 107.5 )
        doc.text ( '%Bonif', 160.5, 107.5 )
        doc.text ( 'TOTAL', 189.5, 107.5 )

        doc.setLineWidth(0.1);
  
        let f = 114;
        doc.setFontSize(7);
        for (let i = 0; i<=item.items.length-1; i++) {
          doc.text (item.items[i].articulo.codigo, 10.5, f )
          doc.text (item.items[i].articulo.nombre.substring(0,38), 31, f )
          doc.text (this.formatMoney(item.items[i].cantidad), 137, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio), 158, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 170, f, 'right')
          //doc.text (this.formatMoney(item.items[i].importedescuento), 155, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 198, f, 'right')
          f += 4.5
        }
        doc.setFontSize(8);

        doc.text (this.formatMoney(item.gravado), 198, 250, 'right')
        doc.text (this.formatMoney(item.tasadescuento), 198, 255, 'right')
        doc.text (this.formatMoney(item.importedescuento), 198, 260, 'right')
        doc.text (this.formatMoney(item.gravado), 198, 265, 'right')
        doc.text (this.formatMoney(item.exento), 198, 270, 'right')
        doc.text (this.formatMoney(item.iva), 198, 275, 'right')

        doc.setFontStyle("bold");
        doc.text (this.formatMoney(item.total), 198, 280, 'right')

      }

      doc.output ('dataurlnewwindow');
    },



    comprasPrintDetalles(item) {

      debugger
      let tipcpr = item.cpr.substr(0,3)
      var doc = new jsPDF();

      if (tipcpr=='FAC' || tipcpr=='NDD' || tipcpr == 'NDC' || tipcpr == 'CIN' || tipcpr == 'PRE') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Stock?                           Depósito', 10, f ); f +=  5
        doc.text ( 'Observ', 10, f ); f +=  10
        doc.text ( 'Total Comprob.', 10, f ); f += 5
        doc.text ( 'Descuento                                                             % Descuento', 10, f ); f += 5

        if (tipcpr!='PAG') {
          doc.text ( 'Ret.IVA                                                                  Ret.GAN                                                 Ret.IB', 10, f ); f += 5
        }

        debugger
        doc.text ( 'Tasas de IVA', 10, f )
        f+=10
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFontStyle("bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                   item.tercero.direcciones[0].postal.codigo+ '-' +
                   item.tercero.direcciones[0].postal.nombre+ ')-' +
                   item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        if (item.regstk==1) {
          doc.text ( 'Sí', 40, f );
        } else {
          doc.text ( 'No', 40, f );
        }
        if (item.deposito_id!=null) {
          doc.text ( item.deposito_id.toString(), 65, f ); f += 5
        }
        if (item.observaciones!=null) {
          doc.text ( item.observaciones , 40, f ); f += 5
        } else {
          doc.text ( '' , 40, f ); f += 5
        }
        f += 5
        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.descuento), 40, f );
        doc.text ( '%'+this.formatMoney(item.tasadescuento), 119, f ); f += 5

        if (tipcpr!='PAG') {
          doc.text ( '$'+this.formatMoney(item.retiva), 40, f ); //f += 5
          doc.text ( '$'+this.formatMoney(item.retgan), 119, f ); //f += 5
          doc.text ( '$'+this.formatMoney(item.retib), 170, f ); f += 5
        }
//        doc.text ( '$'+this.formatMoney(item.gravado), 40, f );
//        doc.text ( '$'+this.formatMoney(item.exento), 130, f );
//        doc.text ( '$'+this.formatMoney(item.iva), 178, f ); f += 5

//        f+=5
        for (let j=0; j<=item.afipiva.length-1; j++) {
          doc.setFontStyle("bold");
          doc.text ( item.afipiva[j].afipiva.nombre, 40, f );
          doc.setFontStyle("normal");
          doc.text ( 'Gravado', 87, f );
          doc.setFontStyle("bold");
          doc.text ( '$'+this.formatMoney(item.afipiva[j].base), 119, f );
          doc.setFontStyle("normal");
          doc.text ( 'IVA', 149, f );
          doc.setFontStyle("bold");
          doc.text ( '$'+this.formatMoney(item.afipiva[j].iva), 170, f );
          f+=5
        }

        doc.setFontStyle("normal");
        doc.setFontSize(8);
        f += 10
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6
        for (let i = 0; i<=item.items.length-1; i++) {
          doc.text (item.items[i].articulo.codigo, 10, f )
          doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio), 151, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5
        }
        doc.setFontSize(10); f += 5
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'FP        NroValor  Cuenta      Fecha Financiera        Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6

        doc.setFontSize(8);
        for (let i = 0; i<=item.valoresEgresos.length-1; i++) {
          fec = moment(item.valoresEgresos[i].fechasalida).format('DD/MM/YYYY')
          doc.text (item.valoresEgresos[i].medio.abrev, 10, f )
          doc.text (item.valoresEgresos[i].nrovalor.toString(), 29, f, 'right' )
          doc.text (fec, 38, f )
          doc.text (item.valoresEgresos[i].observ, 68, f )
          doc.text (this.formatMoney(item.valoresEgresos[i].importe), 196, f, 'right')
          f += 5
        }

        f += 15
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Pendiente en Cta.Cte.                                        Cancelaciones', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Fecha Vencimiento     Importe                   Pendiente         Fecha      Cpr.Cancelador      Observaciones              Importe', 10, f );
        doc.line( 10, f+2, 93,  f+2);     // linea vertical 1
        doc.line( 100, f+2, 196,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        for (let i = 0; i<=item.pendientes.length-1; i++) {
          fec = moment(item.pendientes[i].vencimiento).format('DD/MM/YYYY')
          doc.text (fec, 10, f )
          doc.text (this.formatMoney(item.pendientes[i].importe), 57, f, 'right')
          doc.text (this.formatMoney(item.pendientes[i].pendiente), 91, f, 'right')
          let totCancelado = 0
          for (let j = 0; j<= item.pendientes[i].cancelaciones.length-1; j++) {
            fec = moment(item.pendientes[i].cancelaciones[j].cancelador.fecha).format('DD/MM/YYYY')
            doc.text (fec, 100, f )
            doc.text (item.pendientes[i].cancelaciones[j].cancelador.cpr, 116, f)
            doc.text (item.pendientes[i].cancelaciones[j].concepto, 147, f)
            doc.text (this.formatMoney(item.pendientes[i].cancelaciones[j].importe), 196, f, 'right')
            totCancelado += item.pendientes[i].cancelaciones[j].importe
            f += 5
          }
          f -= 2
          doc.line( 100, f, 196,  f); f += 5
          doc.text (this.formatMoney(totCancelado), 196, f, 'right')
        }
      
      } else if (tipcpr=='PAG') {

        doc.setFontSize(20);
        doc.text ( 'PAGO', 10, 20 )
        doc.line( 10, 22, 30, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Receptor', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Observ', 10, f ); f +=  5
        doc.text ( 'Total Pago', 10, f ); f += 5

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        
        doc.setFontStyle("bold");
        doc.text ( item.cpr, 40, f ); f += 5
        doc.setFontStyle("normal");        

        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                   item.tercero.direcciones[0].postal.codigo+ '-' +
                   item.tercero.direcciones[0].postal.nombre+ ')-' +
                   item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        if (item.observaciones!=null) {
          doc.text ( item.observaciones , 40, f ); f += 5
        } else {
          doc.text ( '' , 40, f ); f += 5
        }
        doc.text ( '$'+this.formatMoney(item.total), 40, f );

        doc.setFontSize(12); f += 15
        doc.setFontStyle("bold");
        doc.text ( 'Valores', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'FP        NroValor  Fecha Financiera   Observaciones                                                                                              Importe ', 10, f );
        doc.line( 10, f+2, 196,  f+2);     // linea vertical 1
        f += 6

        debugger
        doc.setFontSize(8);
        for (let i = 0; i<=item.valoresEgresos.length-1; i++) {
          fec = moment(item.valoresEgresos[i].fechasalida).format('DD/MM/YYYY')
          doc.text (item.valoresEgresos[i].medio.abrev, 10, f )
          if (item.valoresEgresos[i].nrovalor!=null) {
            doc.text (item.valoresEgresos[i].nrovalor.toString(), 29, f, 'right' )
          }
          doc.text (fec, 38, f )
          doc.text (item.valoresEgresos[i].observ, 68, f )
          doc.text (this.formatMoney(item.valoresEgresos[i].importe), 196, f, 'right')
          f += 5
        }

        f += 15
        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Cancelaciones', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Comprobante           Fecha Vencimiento           Importe                   Pendiente', 10, f );
        doc.line( 10, f+2, 130,  f+2);     // linea vertical 1
        doc.setFontSize(8);
        f += 6
        debugger
        for (let i = 0; i<=item.cancelaciones.length-1; i++) {
          fec = moment(item.cancelaciones[i].cancelado.vencimiento).format('DD/MM/YYYY')
          doc.text (item.cancelaciones[i].cancelado.comprobante.cpr, 10, f )
          doc.text (fec, 42, f )
          doc.text (this.formatMoney(item.cancelaciones[i].cancelado.importe), 95, f, 'right')
          doc.text (this.formatMoney(item.cancelaciones[i].cancelado.pendiente), 130, f, 'right')
          f += 5
        }

      } else if (tipcpr=='PED') {

        doc.setFontSize(20);
        doc.text ( 'Detalles del Comprobante', 10, 20 )
        doc.line( 10, 22, 93, 22);

        doc.setFontSize(8);
        doc.text ( 'gohu', 195 , 5 )

        let f = 30
        doc.setFontSize(10);
        doc.text ( 'Comprobante', 10, f ); f += 5
        doc.text ( 'Fecha', 10, f ); f += 5
        doc.text ( 'Cliente', 10, f ); f += 5
        doc.text ( 'Direccion', 10, f ); f += 5
        doc.text ( 'Documento                                                   Cond.IVA', 10, f ); f += 5
        doc.text ( 'Total Pedido', 10, f ); f += 5
        doc.text ( 'Estado', 10, f ); f += 5
        f+=10

        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text ( 'Items', 10, f ); f += 5
        doc.setFontStyle("normal");
        doc.setFontSize(10);
        doc.text ( 'Código          Descripción                                                                            Ctt.            Precio  %Des.    $Des.        TOTAL', 10, f ); f += 5
        doc.setFontStyle("bold");

        f = 30
        let fec = moment(item.fecha).format('DD/MM/YYYY')
        doc.text ( item.cpr, 40, f ); f += 5
        doc.text ( fec, 40, f ); f += 5
        doc.text ( item.tercero.nombre+' ('+item.tercero.id+')', 40, f ); f += 5
        doc.text ( item.tercero.direcciones[0].direccion+' ('+
                   item.tercero.direcciones[0].postal.codigo+ '-' +
                   item.tercero.direcciones[0].postal.nombre+ ')-' +
                   item.tercero.direcciones[0].postal.provincia.nombre+ '-' +
                   item.tercero.direcciones[0].postal.provincia.pais.nombre, 40, f ); f += 5
        doc.text ( item.tercero.documento.nombre+' '+item.tercero.cuit , 40, f ); 
        doc.text ( item.tercero.responsable.nombre , 95, f ); f += 5
        doc.text ( '$'+this.formatMoney(item.total), 40, f ); f += 5
        if (item.estado=='F') {
          doc.text ( 'Fnalizado', 40, f ); f += 5
        } else if (item.estado=='P') {
          doc.text ( 'Pendiente', 40, f ); f += 5
        } else if (item.estado=='L') {
          doc.text ( 'Facturado Parcialmente', 40, f ); f += 5
        }
        f += 5

        doc.setFontStyle("normal");
        doc.setFontSize(8);
        f += 17
        doc.line( 10, f, 196,  f);     // linea vertical 1
        f += 5
        for (let i = 0; i<=item.items.length-1; i++) {
          doc.text (item.items[i].articulo.codigo, 10, f )
          doc.text (item.items[i].articulo.nombre.substring(0,55), 31, f )
          doc.text (this.formatMoney(item.items[i].cantidad), 130, f, 'right')
          doc.text (this.formatMoney(item.items[i].precio), 151, f, 'right')
          doc.text (this.formatMoney(item.items[i].tasadescuento), 162, f, 'right')
          doc.text (this.formatMoney(item.items[i].importedescuento), 176, f, 'right')
          doc.text (this.formatMoney(item.items[i].total), 196, f, 'right')
          f += 5
        }
        doc.setFontSize(10);

      }

      doc.output ('dataurlnewwindow');
    },



    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },



    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
      } catch (e) {
        console.log(e)
      }
    },



    esqueleto(datos, img, doc, quien, rangos, pagina) {

      debugger
      if (pagina>0) {
        doc.addPage()
      }

      var qr = new Image();

      if (datos.tipcpr == 'FAC' ||
          datos.tipcpr == 'NDD' ||
          datos.tipcpr == 'NDC' ||
          datos.tipcpr == 'PED' ||
          datos.tipcpr == 'PRE' ||
          datos.tipcpr == 'REC' ||
          datos.tipcpr == 'REM' ||
          datos.tipcpr == 'PAG') {

        let possuc = 0
        for (let i=0; i<=datos.sucursales.length-1; i++) {
          if (datos.sucursales[i].id == datos.sucursal) {
            possuc = i
            break
          }
        }
        let path = 'images/'
        let file = 'Sin Imagen.jpg'
        if (possuc>=0 && datos.sucursales[possuc].logotipo!= null) {
          file = datos.sucursales[possuc].logotipo
        }
        img.src = path + datos.logotipo // file
        doc.addImage(img, 'jpg', 10, 20, 52, 25)

        // CODIGO QR, SOLO PARA COMPROBANTES FISCALES
        if (datos.tipcpr == 'FAC' || datos.tipcpr == 'NDD' || datos.tipcpr == 'NDC') {
          if (pagina==rangos.length-1) {
            let d = "ver:1,fecha:2020-10-13,cuit:30000000007,ptoVta:10,tipoCmp:1,nroCmp:94,importe:12100,moneda:DOL,ctz:65,tipoDocRec:80,nroDocRec:20000000001,tipoCodAut:E,codAut:70417054367476"
            let imgSrc = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+d;
            qr.src = imgSrc
            doc.addImage(qr, 'jpg', 15, 250, 30,  30)
          }
        }

        doc.setFontSize(8);
        doc.text ( 'gohu', 192, 14 )

        doc.setFontSize(9);
        doc.text ( 'Razón Social:', 15, 50 )
        doc.text ( 'Domicilio:', 15, 55 )
        doc.text ( 'Condicion frente al IVA:', 15, 60 )

        doc.setFontSize(14);
        doc.text ( 'ORIGINAL', 93, 16 )

        if (rangos.length>1) {
          doc.setFontSize(8);
          doc.text ( 'Página      de', 150, 15 )
          let p = pagina+1
          doc.text ( p.toString(), 161, 15)
          doc.text ( rangos.length.toString(), 169, 15)
        }

        doc.setFontSize(16);
        if (datos.tipcpr=='FAC') {
          doc.text ( 'FACTURA', 120, 27 )
        } else if (datos.tipcpr=='NDD') {
          doc.text ( 'NOTA DE DEBITO', 120, 27 )
        } else if (datos.tipcpr=='NDC') {
          doc.text ( 'NOTA DE CREDITO', 120, 27 )
        } else if (datos.tipcpr=='PED') {
          doc.text ( 'PEDIDO', 120, 27 )
        } else if (datos.tipcpr=='PRE') {
          doc.text ( 'PRESUPUESTO', 120, 27 )
        } else if (datos.tipcpr=='REC') {
          doc.text ( 'RECIBO', 120, 27 )
        } else if (datos.tipcpr=='PAG') {
          doc.text ( 'NOTA DE PAGO', 120, 27 )
        } else if (datos.tipcpr=='REM') {
          doc.text ( 'REMITO', 120, 27 )
        }

        doc.setFontSize(9);
        doc.text ( 'Punto de Venta', 120, 35 )
        doc.text ( 'Comp. Nro', 157, 35 )
        doc.text ( 'Fecha de Emisión:', 120, 41 )
        doc.text ( 'CUIT', 120, 47 )
        doc.text ( 'Ingresos Brutos', 120, 53 )
        doc.text ( 'Fecha de Inicio de Actividades', 120, 59 )

        doc.setFontStyle("bold");
        doc.text ( 'NO', 144, 53 )
        doc.text ( '01/01/2000', 166, 59 )

        doc.setFontStyle("normal");
        doc.text ( 'Vencimiento del Comprobante', 15, 72 )
        doc.text ( 'CUIT', 15, 83 )
        doc.text ( 'Condicion de IVA', 15, 89 )
        doc.text ( 'Condicion de Venta', 15, 95 )
        doc.text ( 'Nombre / Razón Social', 90, 83 )
        doc.text ( 'Domicilio', 90, 89 )

        doc.rect(  10,  10, 190,  10);     // segundo rectangulo
        doc.rect(  10,  20, 190,  45);     // primer rectangulo
        doc.rect(  97,  20,  16,  20);     // rectangulo de la letra
        doc.line( 105,40.1, 105,  65);     // linea vertical 1
        doc.rect(  10,  66, 190,  10);     // segundo rectangulo
        doc.rect(  10,  77, 190,  25);     // segundo rectangulo

        debugger
        if (datos.tipcpr == 'FAC' ||
            datos.tipcpr == 'NDD' ||
            datos.tipcpr == 'NDC' ||
            datos.tipcpr == 'PED' ||
            datos.tipcpr == 'REM' ||
            datos.tipcpr == 'PRE') {
          doc.setFontSize(8);
          doc.setDrawColor(0);
          doc.setFillColor(234, 234, 234);
          doc.rect( 10, 103, 20, 7, 'FD');  //codigo
          doc.rect( 31, 103, 86, 7, 'FD');  //descripcion
          doc.rect(118, 103, 20, 7, 'FD');  //cantidad
          doc.rect(139, 103, 20, 7, 'FD');  //precio
          doc.rect(160, 103, 11, 7, 'FD');  // % Bonif
          doc.rect(172, 103, 28, 7, 'FD');  //TOTAL

          doc.text ( 'Codigo', 12.5, 107.5 )
          doc.text ( 'Descripción', 33.5, 107.5 )
          doc.text ( 'Cantidad', 125.5, 107.5 )
          doc.text ( 'Precio Unit.', 143.5, 107.5 )
          doc.text ( '%Bonif', 160.5, 107.5 )
          doc.text ( 'TOTAL', 189.5, 107.5 )

          // pie
          if (pagina==rangos.length-1) {
            doc.rect(  10, 240, 190,  45);     // rectangulo
            doc.text ( 'Observaciones', 13, 245 )
            if (datos.recargo!=0) {
              doc.text ( 'Recargo', 155, 245 )
            }
            doc.text ( 'Subtotal', 155, 250 )
            doc.text ( '%Descuento', 155, 255 )
            doc.text ( 'Descuento', 155, 260 )
            doc.text ( 'Gravado', 155, 265 )
            doc.text ( 'Exento', 155, 270 )
            doc.text ( 'IVA', 155, 275 )
            doc.text ( 'TOTAL', 155, 282 )
          }

        } else if ( datos.tipcpr == 'REC' ) {

          doc.setFontSize(12);
          doc.text ( 'TOTAL RECIBO', 135, 282 )

        } else if ( datos.tipcpr == 'PAG' ) {

          doc.setFontSize(12);
          doc.text ( 'TOTAL PAGO', 135, 282 )

        }
      }
    },



    cabecera(datos, doc, rangos, pagina) {

      debugger
      doc.setFontStyle("bold");
      doc.setFontSize(36);
      doc.text ( datos.cpr.substring(4,5), 100.5, 32 )
      doc.setFontSize(9);

      doc.text ( datos.emiRazonSocial, 37, 50 )
      doc.setFontSize(6);
      if (datos.tipcpr=='FAC' && datos.recargo>0) {
        doc.text ( 'Este comprobante posee recargo por la forma de pago utilizada', 13, 238 )  
      }
      doc.text ( datos.emiDireccion, 31, 55 )
      doc.text ( datos.emiResponsable, 51, 60 )
      doc.setFontSize(9);

      doc.text ( moment(String(datos.fecha)).format('L'), 148, 41 )
      doc.text ( datos.cpr.substring(6,10), 144, 35 )
      doc.text ( datos.cpr.substring(11,19), 174, 35 )
      doc.text ( datos.emiCUIT, 129, 47 )

      doc.text ( datos.recCUIT, 24, 83 )
      doc.text ( datos.recRazonSocial, 125, 83 )
      doc.text ( datos.recResponsable, 42, 89 )
      doc.text ( 'CONTADO', 45, 95 )
      
      doc.setFontSize(7);
      doc.text ( datos.recDireccion, 105, 89 )

    },



    detalles(datos, doc, rangos, pagina) {

      if (datos.tipcpr == 'FAC' || 
          datos.tipcpr == 'NDD' ||
          datos.tipcpr == 'NDC' ||
          datos.tipcpr == 'PED' ||
          datos.tipcpr == 'REM' ||
          datos.tipcpr == 'PRE') {

        doc.setFontStyle("normal");
        doc.setLineWidth(0.1);
        let f = 114;
        doc.setFontSize(7);
        if (rangos[pagina].desde!=0 && rangos[pagina].hasta!=0) {
          for (let i = rangos[pagina].desde-1; i<=rangos[pagina].hasta-1; i++) {
            if (datos.items[i].articulo.id===1) {
              doc.text (datos.items[i].texto.substring(0,65), 10, f )
            } else {
              doc.text (datos.items[i].articulo.codigo, 10, f )
              doc.text (datos.items[i].articulo.nombre.substring(0,55), 31, f )
            }
            doc.text (this.formatMoney(datos.items[i].cantidad), 137, f, 'right')
            doc.text (this.formatMoney(datos.items[i].precio), 158, f, 'right')
            doc.text (this.formatMoney(datos.items[i].tasadescuento), 170, f, 'right')
            doc.text (this.formatMoney(datos.items[i].total), 198, f, 'right')
            f += 4.5
          }
        }

        debugger
        // pie
        if (pagina==rangos.length-1) {
          doc.setFontSize(8);
          if (datos.recargo!=0) {
            doc.text (this.formatMoney(datos.recargo), 198, 245, 'right')
          }
          doc.text (this.formatMoney(datos.totales.gravado), 198, 250, 'right')  
          if (datos.totales.tasadescuento!=0) {
            doc.text (this.formatMoney(datos.totales.tasadescuento), 198, 255, 'right')
            doc.text (this.formatMoney(datos.totales.importedescuento), 198, 260, 'right')
          } else {
            doc.text (this.formatMoney(0), 198, 255, 'right')
            doc.text (this.formatMoney(0), 198, 260, 'right')
          }
          doc.text (this.formatMoney(datos.totales.gravado), 198, 265, 'right')
          doc.text (this.formatMoney(datos.totales.exento), 198, 270, 'right')
          doc.text (this.formatMoney(datos.totales.iva), 198, 275, 'right')

          doc.setFontSize(12);
          doc.setFontStyle("bold");
          doc.text (this.formatMoney(datos.totales.total), 198, 282, 'right')
        }

      } else if (datos.tipcpr=='REC') {

        let headersRes = [
          { title: 'Cpr Cancelado', dataKey:'cpr' }, 
          { title: 'Cancelado', dataKey:'cancelado' } ]
        
        let headersVal = [
          { title: 'Medio',   dataKey:'abrev' }, 
          { title: 'Banco',   dataKey:'banco' },
          { title: 'Tarjeta', dataKey:'tarjeta' },
          { title: 'NroVal',  dataKey:'nrovalor' },
          { title: 'FecFin',  dataKey:'fechafinanciera' },
          { title: 'Importe', dataKey:'importe' }, ]
        
        let cancelaciones = []
        let valores = []

        for (let i=0; i<=datos.cancelaciones.length-1; i++) {
          cancelaciones.push({ 
            cpr: datos.cancelaciones[i].cancelado.comprobante.cpr, 
            cancelado: this.formatoImporte(datos.cancelaciones[i].importe) })
        }

        let banco = '' 
        let tarjeta = ''
        for (let i=0; i<=datos.valoresIngresos.length-1; i++) {
          
          banco = ''
          if (datos.valoresIngresos[i].banco!=null) {
            banco = datos.valoresIngresos[i].banco.nombre 
          }

          tarjeta = ''
          if (datos.valoresIngresos[i].tarjeta!=null) {
            tarjeta = datos.valoresIngresos[i].tarjeta.nombre
          }

          valores.push({ 
            abrev: datos.valoresIngresos[i].medio.abrev,
            banco: banco,
            tarjeta: tarjeta,
            importe: this.formatoImporte(datos.valoresIngresos[i].importe) })
        
        }

        doc.setFontStyle("bold")
        doc.setFontSize(10)
        doc.text('Cancelaciones', 15, 108)
        doc.setFontStyle("normal")

        const totalPagesExp = '{total_pages_count_string}'
        doc.autoTable(headersRes, cancelaciones, {
          margin: {top: 110, bottom: 25},
          headStyles: { fillColor: [192,192,192], fontSize: 9,},
          styles: { textColor: [58,58,58], fontSize: 9,},
          showHeader: true,
          columnStyles: {
            total: { halign: 'right', width: 160, },
            styles: {fillColor: [100, 255, 255], fontSize: 9 },
            columnStyles: { id: {fillColor: 125} },
          },
        });

        var finalY = doc.lastAutoTable.finalY
        doc.setFontStyle("bold");
        doc.setFontSize(10);
        doc.text('Valores Egresados', 15, finalY+5)
        doc.setFontStyle("normal");

        doc.autoTable(headersVal, valores, {
          margin: {top: 100, bottom: 25},
          headStyles: { fillColor: [192,192,192], fontSize: 9,},
          styles: { textColor: [58,58,58], fontSize: 9,},
          showHeader: true,
          columnStyles: {
            total: { halign: 'right', width: 160, },
            styles: {fillColor: [100, 255, 255], fontSize: 9 },
            columnStyles: { id: {fillColor: 125} },
          },

        });

        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text (this.formatMoney(datos.totales.total), 198, 282, 'right')

      } else if (datos.tipcpr=='PAG') {

        let headersRes = [
          { title: 'Cpr Cancelado', dataKey:'cpr' }, 
          { title: 'Cancelado', dataKey:'cancelado' } ]
        
        let headersVal = [
          { title: 'Medio',   dataKey:'abrev' }, 
          { title: 'Banco',   dataKey:'banco' },
          { title: 'Tarjeta', dataKey:'tarjeta' },
          { title: 'NroVal',  dataKey:'nrovalor' },
          { title: 'FecFin',  dataKey:'fechafinanciera' },
          { title: 'Importe', dataKey:'importe' }, ]
        
        let cancelaciones = []
        let valores = []

        for (let i=0; i<=datos.cancelaciones.length-1; i++) {
          cancelaciones.push({ 
            cpr: datos.cancelaciones[i].cancelado.comprobante.cpr, 
            cancelado: this.formatoImporte(datos.cancelaciones[i].importe) })
        }

        let banco = '' 
        let tarjeta = ''
        for (let i=0; i<=datos.valoresEgresos.length-1; i++) {
          
          banco = ''
          if (datos.valoresEgresos[i].banco!=null) {
            banco = datos.valoresEgresos[i].banco.nombre 
          }

          tarjeta = ''
          if (datos.valoresEgresos[i].tarjeta!=null) {
            tarjeta = datos.valoresEgresos[i].tarjeta.nombre
          }

          valores.push({ 
            abrev: datos.valoresEgresos[i].medio.abrev,
            banco: banco,
            tarjeta: tarjeta,
            importe: this.formatoImporte(datos.valoresEgresos[i].importe) })
        
        }

        doc.setFontStyle("bold")
        doc.setFontSize(10)
        doc.text('Cancelaciones', 15, 108)
        doc.setFontStyle("normal")

        const totalPagesExp = '{total_pages_count_string}'
        doc.autoTable(headersRes, cancelaciones, {
          margin: {top: 110, bottom: 25},
          headStyles: { fillColor: [192,192,192], fontSize: 9,},
          styles: { textColor: [58,58,58], fontSize: 9,},
          showHeader: true,
          columnStyles: {
            total: { halign: 'right', width: 160, },
            styles: {fillColor: [100, 255, 255], fontSize: 9 },
            columnStyles: { id: {fillColor: 125} },
          },
        });

        var finalY = doc.lastAutoTable.finalY
        doc.setFontStyle("bold");
        doc.setFontSize(10);
        doc.text('Valores Egresados', 15, finalY+5)
        doc.setFontStyle("normal");

        doc.autoTable(headersVal, valores, {
          margin: {top: 100, bottom: 25},
          headStyles: { fillColor: [192,192,192], fontSize: 9,},
          styles: { textColor: [58,58,58], fontSize: 9,},
          showHeader: true,
          columnStyles: {
            total: { halign: 'right', width: 160, },
            styles: {fillColor: [100, 255, 255], fontSize: 9 },
            columnStyles: { id: {fillColor: 125} },
          },

        });

        doc.setFontSize(12);
        doc.setFontStyle("bold");
        doc.text (this.formatMoney(datos.totales.total), 198, 282, 'right')

      }

    }

  },

};
</script>
