// import createPersistedState from 'vuex-persistedstate';
// eslint-disable-next-line import/no-cycle
// import { snakeCase } from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line import/no-cycle
import authentication from './authentication';

Vue.use(Vuex);
Vue.config.devtools = true;

export const strict = false;

export default new Vuex.Store({
  /* eslint-disable */
  strict: true,
  state: {
    dolar: 0,
    anclarCostos: false,
    desanclarAutomaticamente: 0,
    externo: false,
    inicial: false,
    ofertas: false,
    contadorBloqueado: false,
    hayCarrito: false,
    hayPedidos: false,
    grupoCarrito: 0,
    novedadesCprs: 0,
    novedadesGohu: 0,
    formTercerosTitulo: '',
    formTercerosPath: '',
    sucursal: '',
    sucursalDemo: '',
    sucursales: [],
    proveedor: '',
    proveedores: [],
    roles: [],
    timeoutRefresh: '',
    publicarpreciosconiva: false,
    avatar: '',
    tema: '',
    temas: null,
    logotipo: '',
    notificaciones: [],
    notificacionesgohu: [],
    vinculosPadres: [],
    vinculosHijos: [],
    carrusel: [],
    publicaciones: [],
    graficos: false,
    graficosDatos: [],
    sucursalFiscal: '',
    sucursalManual: '',
    rubros: [],
    porRem: null,
    caja: '',
    tipo: '',
    level: null,
    activo: null,
    empresa: null,
    empresaId: null,
    tercero: null,
    responsable: null,
    cuit: null,
    operario: null,
    operarioVendedor: null,
    operarioTerceroId: null,
    operarioId: null,
    baseUrl: '/api',

    temas: {
      forms_titulo_bg: '',
      forms_titulo_dark: '',
      forms_close_bg: '',
      forms_close_dark: '',
      forms_btn_add_bg: '',
      forms_btn_add_dark: '',
      forms_btn_xls_bg: '',
      forms_btn_xls_dark: '',
      forms_btn_pdf_bg: '',
      forms_btn_pdf_dark: '',
      forms_btn_activo_bg: '',
      forms_btn_activo_dark: '',
      forms_btn_inactivo_bg: '',
      forms_btn_inactivo_dark: '',
      forms_btn_editar_bg: '',
      forms_btn_editar_dark: '',
      forms_btn_borrar_bg: '',
      forms_btn_borrar_dark: '',
      forms_btn_activar_bg: '',
      forms_btn_activar_dark: '',
      forms_btn_print_bg: '',
      forms_btn_print_dark: '',

      notif_cprs_bg: '',
      notif_cprs_bg_dark: '',
      notif_cprs_title_bg: '',
      notif_cprs_title_dark: '',
      notif_cprs_text_bg: '',
      notif_cprs_text_dark: '',
      notif_cprs_btn_bg: '',
      notif_cprs_btn_dark: '',

      notif_pago_bg: '',
      notif_pago_bg_dark: '',
      notif_pago_title_bg: '',
      notif_pago_title_dark: '',
      notif_pago_text_bg: '',
      notif_pago_text_dark: '',

      notif_rechazo_bg: '',
      notif_rechazo_bg_dark: '',
      notif_rechazo_title_bg: '',
      notif_rechazo_title_dark: '',
      notif_rechazo_text_bg: '',
      notif_rechazo_text_dark: '',

      snack_ok_bg: '',
      snack_ok_dark: '',
      snack_error_bg: '',
      snack_error_dark: '',

      barra_principal_bg: '',
      barra_principal_dark: '',
      barra_principal_sucursal_bg: '',
      barra_principal_sucursal_dark: '',
      barra_principal_botonapp_bg: '',
      barra_principal_botonapp_dark: '',
      barra_principal_empusr_bg: '',
      barra_principal_empusr_dark: '',
      barra_principal_profile_bg: '',
      barra_principal_profile_dark: '',
      barra_principal_salir_bg: '',
      barra_principal_salir_dark: '',

      barra_lateral_bg: '',
      barra_lateral_dark: '',

      card_ventas_bg: '',
      card_ventas_dark: '',
      card_compras_bg: '',
      card_compras_dark: '',
      card_acobrar_bg: '',
      card_acobrar_dark: '',
      card_apagar_bg: '',
      card_apagar_dark: '',
      card_valores_bg: '',
      card_valores_dark: '',
      card_pedidos_bg: '',
      card_pedidos_dark: '',

      cen_card_activo_bg: '',
      cen_card_activo_dark: '',
      cen_facturas_bg: '',
      cen_facturas_dark: '',
      cen_creditos_bg: '',
      cen_creditos_dark: '',
      cen_debitos_bg: '',
      cen_debitos_dark: '',
      cen_presupuestos_bg: '',
      cen_presupuestos_dark: '',
      cen_remitos_bg: '',
      cen_remitos_dark: '',
      cen_pedidos_bg: '',
      cen_pedidos_dark: '',
      cen_recibos_bg: '',
      cen_recibos_dark: '',
      cen_gastos_bg: '',
      cen_gastos_dark: '',
      cen_pagos_bg: '',
      cen_pagos_dark: '',
      cen_filtros_bg: '',
      cen_filtros_dark: '',
      cen_titulo_bg: '',
      cen_titulo_dark: '',
      cen_close_bg: '',
      cen_close_dark: '',
      cen_estado_vencehoy_bg: '',
      cen_estado_vencehoy_dark: '',
      cen_estado_finalizado_bg: '',
      cen_estado_finalizado_dark: '',
      cen_estado_avencer_bg: '',
      cen_estado_avencer_dark: '',
      cen_estado_vencido_bg: '',
      cen_estado_vencido_dark: '',
      cen_estado_pendiente_bg: '',
      cen_estado_pendiente_dark: '',
      cen_estado_facturado_bg: '',
      cen_estado_facturado_dark: '',
      cen_estado_enembalaje_bg: '',
      cen_estado_enembalaje_dark: '',
      cen_estado_embalado_bg: '',
      cen_estado_embalado_dark: '',
      cen_estado_enviado_bg: '',
      cen_estado_enviado_dark: '',
      cen_estado_anulado_bg: '',
      cen_estado_anulado_dark: '',
      cen_estado_promocion_bg: '',
      cen_estado_promocion_dark: '',
      cen_btns_bg: '',
      cen_btns_dark: '',

    },
    centrales: {
      ventas_panel: '',
      ventas_filtro: '',
      ventas_buscar: '',
      compras_panel: '',
      compras_filtro: '',
      compras_buscar: '',
    },
    datosEmpresa: { 
      id:                   0,
      nombre:               '',
      razon_social:         '',
      responsable_id:       '',
      responsableNombre:    '',
      direccion_id:         '',
      direccionNombre:      '',
      documento_id:         '',
      documentoNombre:      '',
      cuit:                 '',
      cuentas:              '',
      pathDocs:             '',
      faeproduccion:        '',
      faevencimiento:       '',
    },
    datosPanel: {
      ventasDelDia:         0,
      ventasCttCbtesDelDia: 0,
      ventasDelMes:         0,
      ventasCttCbtesDelMes: 0,
      comprasDelMes:        0,
      gastosDelMes:         0,
      debAVencer:           0,
      debVencidos:          0,
      creAVencer:           0,
      creVencidos:          0,
      anotador:             0,
      pedCantidad:          0,
      pedTotal:             0,
    },
    snackbar: {
      visible: false,
      color: 'success',
      text: null,
      timeout: 1500,
      button: true,
      multiline: false,
    },
    //snack: {},
    message: {
      visible: false,
      title: null,
      body: null,
      response: null,
    },
  },

  modules: {
    authentication,
  },

  actions: {
    //    setSnack({ commit }, snack) {
    //      commit("SET_SNACK", snack );
    //    },
  },
   
  mutations: {

//    setSnackOff(state) {
//      debugger
//      state.snack.showing = false;
//    },

//    SET_SNACK(state, snack) {
//      debugger
//      state.snack = snack
//      state.snack.showing = true;
//    },

    alert(state, payload) {
      state.snackbar.text = payload.text;
      state.snackbar.multiline = payload.text.length >= 50;
      // Si es mas de 50 caracteres definirlo como multilinea
//    if (payload.multiline) {
//      state.snackbar.multiline = payload.multiline;
//    }
      // Color para mensajes de error o éxito
      if (payload.color) {
        state.snackbar.color = payload.color;
      }
      state.snackbar.button = payload.button!=null ? payload.button : false
      // Tiempo de duración
      if (payload.timeout) {
        state.snackbar.timeout = payload.timeout;
      }
      state.snackbar.visible = true;

    },

    closeAlert(state) {
      state.snackbar.visible = false;
      state.snackbar.multiline = false;
      state.snackbar.text = null;
    },

    setTerceros(state, payload) {
      if (payload === 'C') {
        state.formTercerosTitulo = 'Clientes';
        state.formTercerosPath = 'usersclientes';
      } else if (payload === 'P') {
        state.formTercerosTitulo = 'Proveedores';
        state.formTercerosPath = 'usersproveedores';
      } else if (payload === 'V') {
        state.formTercerosTitulo = 'Equipo';
        state.formTercerosPath = 'usersequipo';
      } else if (payload === 'T') {
        state.formTercerosTitulo = 'Transportistas';
        state.formTercerosPath = 'userstransportistas';
      } else if (payload === 'R') {
        state.formTercerosTitulo = 'Puntos de Retiro';
        state.formTercerosPath = 'userspuntosderetiro';
      } else if (payload === 'G') {
        state.formTercerosTitulo = 'Terceros Gastos';
        state.formTercerosPath = 'userstercerosgastos';
      }
    },

    setDolar(state, payload) {
      state.dolar = payload;
    },

    setAnclarCostos(state, payload) {
      state.anclarCostos = payload;
    },

    setDesanclarAutomaticamente(state, payload) {
      state.desanclarAutomaticamente = payload;
    },

    setNovedadesCprs(state, payload) {
      state.novedadesCprs = payload;
    },

    setNovedadesGohu(state, payload) {
      state.novedadesGohu = payload;
    },

    setSucursal(state, payload) {
      state.sucursal = payload;
    },

    setSucursales(state, payload) {
      state.sucursales = payload;
    },

    setRoles(state, payload) {
      state.roles = []
      for (let i=0; i<=payload.length-1; i++) {
        state.roles.push({
          id:         payload[i].id,
          nombre:     payload[i].nombre,
          tipo:       payload[i].tipo,
          activo:     payload[i].activo,
          opcion_id:  payload[i].opcion_id,
          acceder:    payload[i].acceder,
          agregar:    payload[i].agregar,
          editar:     payload[i].editar,
          desactivar: payload[i].desactivar,
          state:      null, 
        })
      }
    },

    setExterno(state, payload) {
      state.externo = payload
    },

    setOfertas(state, payload) {
      state.ofertas = payload
    },

    setInicial(state, payload) {
      state.inicial = payload
    },

    setHayCarrito(state, payload) {
      state.hayCarrito = payload
    },

    setHayPedidos(state, payload) {
      state.hayPedidos = payload
    },

    setGrupoCarrito(state, payload) {
      state.grupoCarrito = payload
    },

    setContadorBloqueado(state, payload) {
      state.contadorBloqueado = payload
    },

    setProveedor(state, payload) {
      state.proveedor = payload;
    },

    setProveedores(state, payload) {
      let losProv = []
      if (payload.length>0) {
//      if (payload[0].esOperarioVendedor!=undefined) {
//        losProv = []
//      } else {
//        losProv = [ { id: 0, nombre: 'SIN SELECCIONAR', preciosconiva: 0, tercero_id: null } ]
//      }
        for (let i=0; i<=payload.length-1; i++) {
          losProv.push({
            avatar: payload[i].avatar,
            id: payload[i].id,
            nombre: payload[i].nombre,
            preciosconiva: payload[i].preciosconiva,
            tercero_id: payload[i].tercero_id
          })
        }
      }
      state.proveedores = losProv;
    },

    setSucursalDemo(state, payload) {
      state.sucursalDemo = payload;
    },

    setCarrusel(state, payload) {
      state.carrusel = payload;
    },

    setPublicaciones(state, payload) {
      state.publicaciones = payload;
    },

    setGraficos(state, payload) {
      state.graficos = payload;
    },

    setGraficosDatos(state, payload) {
      state.graficosDatos = payload;
    },

    setActPublicacion(state, payload) {
      for ( let i=0; i<= this.state.publicaciones.length-1; i++) {
        if (this.state.publicaciones[i].articulo_id == payload[0].articulo_id ) {
          this.state.publicaciones[i].unidades += payload[0].ctt
          this.state.publicaciones[i].vendidas -= payload[0].ctt
          break
        }
      }
    },

    setCttPublicacion(state, payload) {
      for ( let i=0; i<= this.state.publicaciones.length-1; i++) {
        if (this.state.publicaciones[i].articulo_id == payload[0].articulo_id ) {
          this.state.publicaciones[i].ctt += Number(payload[0].ctt)
          break
        }
      }
    },

    setVaciarCarro(state, payload) {
      for ( let i=0; i<= this.state.publicaciones.length-1; i++) {
        this.state.publicaciones[i].ctt = 0
      }
    },

    setPublicacionLoQuieroOff(state, payload) {
      state.publicaciones[payload].loquiero = false
    },

    setPublicacionLoQuieroOn(state, payload) {
      state.publicaciones[payload].loquiero = true
    },

    setSucursalFiscal(state, payload) {
      state.sucursalFiscal = payload;
    },

    setSucursalManual(state, payload) {
      state.sucursalManual = payload;
    },

    setAvatar(state, payload) {
      state.avatar = payload;
    },

    setLogotipo(state, payload) {
      state.logotipo = payload;
    },

    setNotificaciones(state, payload) {
      state.notificaciones = payload;
    },

    setNotificacionesgohu(state, payload) {
      state.notificacionesgohu = payload;
    },

    actNotificacion(state, payload) {
      for (let i=0; i<=state.notificaciones.length-1; i++) {
        if (payload==state.notificaciones[i].id) {
          state.notificaciones[i].estado = 'R'
          state.notificaciones[i].paraprocesar = false
        }
      }
    },

    actDetallesPublicacion(state, payload) {
      for (let i=0; i<=state.publicaciones.length-1; i++) {
        if (payload==state.publicaciones[i].id) {
          state.publicaciones[i].say = !state.publicaciones[i].say
        }
      }
    },

    setCaja(state, payload) {
      state.caja = payload;
    },

    setVinculosPadres(state, payload) {
      state.vinculosPadres = payload;
    },

    setVinculosHijos(state, payload) {
      state.vinculosHijos = payload;
    },

    setTipo(state, payload) {
      state.tipo = payload;
    },

    setEmpresa(state, payload) {
      state.empresa = payload;
    },

    setEmpresaId(state, payload) {
      state.empresaId = payload;
    },

    setTercero(state, payload) {
      state.tercero = payload;
    },

    setRubros(state, payload) {
      state.rubros = payload;
    },

    setActivo(state, payload) {
      state.activo = payload;
    },

    setResponsable(state, payload) {
      state.responsable = payload;
    },

    setCuit(state, payload) {
      state.cuit = payload;
    },

    setOperario(state, payload) {
      state.operario = payload;
    },

    setOperarioVendedor(state, payload) {
      state.operarioVendedor = payload;
    },

    setOperarioId(state, payload) {
      state.operarioId = payload;
    },

    setOperarioTerceroId(state, payload) {
      state.operarioTerceroId = payload;
    },

    setLevel(state, payload) {
      state.level = payload
    },

    setPorRem(state, payload) {
      state.porRem = payload
    },

    setTimeoutRefresh(state, payload ) {
      state.timeoutRefresh = payload
    },

    setPublicarPreciosConIVA(state, payload ) {
      state.publicarpreciosconiva = payload
    },

    setCentrales(state, payload) {
      if (payload.ventas_panel!=undefined)  {
        state.centrales.ventas_panel    = payload.ventas_panel
      }
      if (payload.ventas_filtro!=undefined) {
        state.centrales.ventas_filtro   = payload.ventas_filtro
      }
      if (payload.ventas_buscar!=undefined) {
        state.centrales.ventas_buscar   = payload.ventas_buscar
      }
      if (payload.compras_panel!=undefined) {
        state.centrales.compras_panel   = payload.compras_panel
      }
      if (payload.compras_filtro!=undefined) {
        state.centrales.compras_filtro  = payload.compras_filtro
      }
      if (payload.compras_buscar!=undefined) {
        state.centrales.compras_buscar  = payload.compras_buscar
      }
    },

    setDatosEmpresa(state, payload ) {
      if (payload==null || payload.id==0) {
        state.datosEmpresa.id                = 0
        state.datosEmpresa.nombre            = ''
        state.datosEmpresa.razon_social      = ''
        state.datosEmpresa.responsable_id    = 0
        state.datosEmpresa.responsableNombre = ''
        state.datosEmpresa.direccion_id      = ''
        state.datosEmpresa.direccionNombre   = ''
        state.datosEmpresa.documento_id      = 0
        state.datosEmpresa.documentoNombre   = ''
        state.datosEmpresa.cuit              = ''
        state.datosEmpresa.cuentas           = ''
        state.datosEmpresa.pathDocs          = ''
        state.datosEmpresa.faeproduccion     = false
        state.datosEmpresa.faevencimiento    = ''
      } else {
        state.datosEmpresa.id                = payload.tercero.id
        state.datosEmpresa.nombre            = payload.tercero.nombre
        state.datosEmpresa.razon_social      = payload.tercero.razon_social
        state.datosEmpresa.responsable_id    = payload.tercero.responsable_id
        state.datosEmpresa.responsableNombre = payload.tercero.responsable.nombre
        state.datosEmpresa.direccion_id      = payload.tercero.direcciones[0].id

        state.datosEmpresa.direccionNombre   = 
          payload.tercero.direcciones[0].direccion+' '+
          payload.tercero.direcciones[0].postal.nombre+' ) - '+
          payload.tercero.direcciones[0].postal.provincia.nombre+' - '+
          payload.tercero.direcciones[0].postal.provincia.pais.nombre

        state.datosEmpresa.documento_id      = payload.tercero.documento_id
        state.datosEmpresa.documentoNombre   = payload.tercero.documento.nombre
        state.datosEmpresa.cuit              = payload.tercero.cuit
        state.datosEmpresa.cuentas           = payload.tercero.cuentas
        state.datosEmpresa.pathDocs          = '/'+payload.email+'/'
        state.datosEmpresa.faeproduccion     = payload.faeproduccion
        state.datosEmpresa.faevencimiento    = payload.faevencimiento
      }
    },

    setDatosEmpresaCuentas(state, payload ) {
      state.datosEmpresa.cuentas = payload
    },

    setDatosPanel(state, payload) {
      state.datosPanel.ventasDelDia         = payload.ventasDelDia
      state.datosPanel.ventasCttCbtesDelDia = payload.ventasCttCbtesDelDia
      state.datosPanel.ventasDelMes         = payload.ventasDelMes
      state.datosPanel.ventasCttCbtesDelMes = payload.ventasCttCbtesDelMes
      state.datosPanel.comprasDelMes        = payload.comprasDelMes
      state.datosPanel.gastosDelMes         = payload.gastosDelMes
      state.datosPanel.debAVencer           = payload.debAVencer
      state.datosPanel.debVencidos          = payload.debVencidos
      state.datosPanel.creAVencer           = payload.creAVencer
      state.datosPanel.creVencidos          = payload.creVencidos
      state.datosPanel.anotador             = payload.anotador
      state.datosPanel.pedCantidad          = payload.pedCantidad
      state.datosPanel.pedTotal             = payload.pedTotal
    },

    setTema(state, payload) {
      state.tema = payload;
    },

    setTemas(state, payload) {
      if (payload==null) {
        state.temas.forms_titulo_bg                = ''
        state.temas.forms_titulo_dark              = ''
        state.temas.forms_close_bg                 = ''
        state.temas.forms_close_dark               = ''
        state.temas.forms_btn_add_bg               = ''
        state.temas.forms_btn_add_dark             = ''
        state.temas.forms_btn_xls_bg               = ''
        state.temas.forms_btn_xls_dark             = ''
        state.temas.forms_btn_pdf_bg               = ''
        state.temas.forms_btn_pdf_dark             = ''
        state.temas.forms_btn_activo_bg            = ''
        state.temas.forms_btn_activo_dark          = ''
        state.temas.forms_btn_inactivo_bg          = ''
        state.temas.forms_btn_inactivo_dark        = ''
        state.temas.forms_btn_editar_bg            = ''
        state.temas.forms_btn_editar_dark          = ''
        state.temas.forms_btn_borrar_bg            = ''
        state.temas.forms_btn_borrar_dark          = ''
        state.temas.forms_btn_activar_bg           = ''
        state.temas.forms_btn_activar_dark         = ''
        state.temas.forms_btn_print_bg             = ''
        state.temas.forms_btn_print_dark           = ''

        state.temas.notif_cprs_bg                  = ''
        state.temas.notif_cprs_bg_dark             = ''
        state.temas.notif_cprs_title_bg            = ''
        state.temas.notif_cprs_title_dark          = ''
        state.temas.notif_cprs_text_bg             = ''
        state.temas.notif_cprs_text_dark           = ''
        state.temas.notif_cprs_btn_bg              = ''
        state.temas.notif_cprs_btn_dark            = ''

        state.temas.notif_pago_bg                  = ''
        state.temas.notif_pago_bg_dark             = ''
        state.temas.notif_pago_title_bg            = ''
        state.temas.notif_pago_title_dark          = ''
        state.temas.notif_pago_text_bg             = ''
        state.temas.notif_pago_text_dark           = ''

        state.temas.notif_rechazo_bg               = ''
        state.temas.notif_rechazo_bg_dark          = ''
        state.temas.notif_rechazo_title_bg         = ''
        state.temas.notif_rechazo_title_dark       = ''
        state.temas.notif_rechazo_text_bg          = ''
        state.temas.notif_rechazo_text_dark        = ''

        state.temas.snack_ok_bg                    = ''
        state.temas.snack_ok_dark                  = ''
        state.temas.snack_error_bg                 = ''
        state.temas.snack_error_dark               = ''

        state.temas.barra_principal_bg             = ''
        state.temas.barra_principal_dark           = ''
        state.temas.barra_principal_bell_bg        = ''
        state.temas.barra_principal_bell_dark      = ''
        state.temas.barra_principal_sucursal_bg    = ''
        state.temas.barra_principal_sucursal_dark  = ''
        state.temas.barra_principal_botonapp_bg    = ''
        state.temas.barra_principal_botonapp_dark  = ''
        state.temas.barra_principal_empusr_bg      = ''
        state.temas.barra_principal_empusr_dark    = ''
        state.temas.barra_principal_profile_bg     = ''
        state.temas.barra_principal_profile_dark   = ''
        state.temas.barra_principal_salir_bg       = ''
        state.temas.barra_principal_salir_dark     = ''
        state.temas.barra_lateral_bg               = ''
        state.temas.barra_lateral_dark             = ''
        state.temas.barra_lateral_font             = ''

        state.temas.card_ventas_bg                 = ''
        state.temas.card_ventas_dark               = ''
        state.temas.card_compras_bg                = ''
        state.temas.card_compras_dark              = ''
        state.temas.card_acobrar_bg                = ''
        state.temas.card_acobrar_dark              = ''
        state.temas.card_apagar_bg                 = ''
        state.temas.card_apagar_dark               = ''
        state.temas.card_valores_bg                = ''
        state.temas.card_valores_dark              = ''
        state.temas.card_pedidos_bg                = ''
        state.temas.card_pedidos_dark              = ''

        state.temas.cen_card_body_bg               = ''
        state.temas.cen_card_body_dark             = ''
        state.temas.cen_card_activo_bg             = ''
        state.temas.cen_card_activo_dark           = ''

        state.temas.cen_facturas_bg                = ''
        state.temas.cen_facturas_dark              = ''
        state.temas.cen_creditos_bg                = ''
        state.temas.cen_creditos_dark              = ''
        state.temas.cen_debitos_bg                 = ''
        state.temas.cen_debitos_dark               = ''
        state.temas.cen_presupuestos_bg            = ''
        state.temas.cen_presupuestos_dark          = ''
        state.temas.cen_remitos_bg                 = ''
        state.temas.cen_remitos_dark               = ''
        state.temas.cen_pedidos_bg                 = ''
        state.temas.cen_pedidos_dark               = ''
        state.temas.cen_recibos_bg                 = ''
        state.temas.cen_recibos_dark               = ''
        state.temas.cen_gastos_bg                   = ''
        state.temas.cen_gastos_dark                 = ''
        state.temas.cen_pagos_bg                   = ''
        state.temas.cen_pagos_dark                 = ''
        state.temas.cen_filtros_bg                 = ''
        state.temas.cen_filtros_dark               = ''

        state.temas.cen_titulo_bg                  = ''
        state.temas.cen_titulo_dark                = ''
        state.temas.cen_close_bg                   = ''
        state.temas.cen_close_dark                 = ''
        state.temas.cen_estado_vencehoy_bg         = ''
        state.temas.cen_estado_vencehoy_dark       = ''
        state.temas.cen_estado_finalizado_bg       = ''
        state.temas.cen_estado_finalizado_dark     = ''
        state.temas.cen_estado_avencer_bg          = ''
        state.temas.cen_estado_avencer_dark        = ''
        state.temas.cen_estado_vencido_bg          = ''
        state.temas.cen_estado_vencido_dark        = ''
        state.temas.cen_estado_pendiente_bg        = ''
        state.temas.cen_estado_pendiente_dark      = ''
        state.temas.cen_estado_facturado_bg        = ''
        state.temas.cen_estado_facturado_dark      = ''
        state.temas.cen_estado_enembalaje_bg       = ''
        state.temas.cen_estado_enembalaje_dark     = ''
        state.temas.cen_estado_embalado_bg         = ''
        state.temas.cen_estado_embalado_dark       = ''
        state.temas.cen_estado_enviado_bg          = ''
        state.temas.cen_estado_enviado_dark        = ''
        state.temas.cen_estado_anulado_bg          = ''
        state.temas.cen_estado_anulado_dark        = ''
        state.temas.cen_estado_promocion_bg        = ''
        state.temas.cen_estado_promocion_dark      = ''
  
        state.temas.cen_btns_bg                    = ''
        state.temas.cen_btns_dark                  = ''

      } else if (payload=='Otoño') {

        state.temas.forms_titulo_bg                = '#918367FF'
        state.temas.forms_titulo_dark              = true
        state.temas.forms_close_bg                 = '#B8B969FF'
        state.temas.forms_close_dark               = true

        state.temas.forms_btn_add_bg               = '#F48A1BFF'
        state.temas.forms_btn_add_dark             = true
        state.temas.forms_btn_xls_bg               = '#ABC67BFF'
        state.temas.forms_btn_xls_dark             = true
        state.temas.forms_btn_pdf_bg               = '#DCD37FFF'
        state.temas.forms_btn_pdf_dark             = true
        state.temas.forms_btn_activo_bg            = '#DCD37FFF'
        state.temas.forms_btn_activo_dark          = false
        state.temas.forms_btn_inactivo_bg          = '#918367FF'
        state.temas.forms_btn_inactivo_dark        = true
        state.temas.forms_btn_editar_bg            = '#918367FF'
        state.temas.forms_btn_editar_dark          = true
        state.temas.forms_btn_borrar_bg            = '#888E73FF'
        state.temas.forms_btn_borrar_dark          = true
        state.temas.forms_btn_activar_bg           = '#BDC094FF'
        state.temas.forms_btn_activar_dark         = true
        state.temas.forms_btn_print_bg             = '#918367FF'
        state.temas.forms_btn_print_dark           = true

        state.temas.notif_cprs_bg                  = '#9C9272FF'
        state.temas.notif_cprs_bg_dark             = true
        state.temas.notif_cprs_title_bg            = '#D1C52AFF'
        state.temas.notif_cprs_title_dark          = true
        state.temas.notif_cprs_text_bg             = '#9A9655FF'
        state.temas.notif_cprs_text_dark           = true
        state.temas.notif_cprs_btn_bg              = '#ABD449FF'
        state.temas.notif_cprs_btn_dark            = true

        state.temas.notif_pago_bg                  = '#9C9272FF'
        state.temas.notif_pago_bg_dark             = false
        state.temas.notif_pago_title_bg            = '#D1C52AFF'
        state.temas.notif_pago_title_dark          = false
        state.temas.notif_pago_text_bg             = '#9A9655FF'
        state.temas.notif_pago_text_dark           = false

        state.temas.notif_rechazo_bg               = '#FF00FFFF'
        state.temas.notif_rechazo_bg_dark          = false
        state.temas.notif_rechazo_title_bg         = '#FF0000'
        state.temas.notif_rechazo_title_dark       = false
        state.temas.notif_rechazo_text_bg          = '#FF00FFFF'
        state.temas.notif_rechazo_text_dark        = false

        state.temas.snack_ok_bg                    = '#647048FF'
        state.temas.snack_ok_dark                  = true
        state.temas.snack_error_bg                 = '#866C50FF'
        state.temas.snack_error_dark               = true

        state.temas.barra_principal_bg             = '#B6A56FFF'
        state.temas.barra_principal_dark           = true
        state.temas.barra_principal_bell_bg        = '#F6FA00FF'
        state.temas.barra_principal_bell_dark      = true
        state.temas.barra_principal_sucursal_bg    = '#CCB16FFF'
        state.temas.barra_principal_sucursal_dark  = true
        state.temas.barra_principal_botonapp_bg    = '#F8B106FF'
        state.temas.barra_principal_botonapp_dark  = true
        state.temas.barra_principal_empusr_bg      = '#69AC33FF'
        state.temas.barra_principal_empusr_dark    = false
        state.temas.barra_principal_profile_bg     = '#F8B106FF'
        state.temas.barra_principal_profile_dark   = false
        state.temas.barra_principal_salir_bg       = '#F8B106FF'
        state.temas.barra_principal_salir_dark     = false
        state.temas.barra_lateral_bg               = '#8B8B5FFF'
        state.temas.barra_lateral_dark             = true
        state.temas.barra_lateral_font             = '#b9f6ca'

        state.temas.card_ventas_bg                 = '#8B8676FF'
        state.temas.card_ventas_dark               = true
        state.temas.card_compras_bg                = '#888067FF'
        state.temas.card_compras_dark              = true
        state.temas.card_acobrar_bg                = '#867D5FFF'
        state.temas.card_acobrar_dark              = true
        state.temas.card_apagar_bg                 = '#867B57FF'
        state.temas.card_apagar_dark               = true
        state.temas.card_valores_bg                = '#867950FF'
        state.temas.card_valores_dark              = true
        state.temas.card_pedidos_bg                = '#847543FF'
        state.temas.card_pedidos_dark              = true

        state.temas.cen_card_body_bg               = '#EDEEB8FF'
        state.temas.cen_card_body_dark             = false
        state.temas.cen_card_activo_bg             = '#725B26FF'
        state.temas.cen_card_activo_dark           = true

        state.temas.cen_facturas_bg                = '#B8B969FF'
        state.temas.cen_facturas_dark              = true
        state.temas.cen_creditos_bg                = '#B8B969FF'
        state.temas.cen_creditos_dark              = true
        state.temas.cen_debitos_bg                 = '#B8B969FF'
        state.temas.cen_debitos_dark               = true
        state.temas.cen_presupuestos_bg            = '#B8B969FF'
        state.temas.cen_presupuestos_dark          = true
        state.temas.cen_remitos_bg                 = '#B8B969FF'
        state.temas.cen_remitos_dark               = true
        state.temas.cen_pedidos_bg                 = '#A89360FF'
        state.temas.cen_pedidos_dark               = true
        state.temas.cen_recibos_bg                 = '#C5B27FFF'
        state.temas.cen_recibos_dark               = true
        state.temas.cen_gastos_bg                  = '#C5B27FFF'
        state.temas.cen_gastos_dark                = true
        state.temas.cen_pagos_bg                   = '#C5B27FFF'
        state.temas.cen_pagos_dark                 = true
        state.temas.cen_filtros_bg                 = '#B8B969FF'
        state.temas.cen_filtros_dark               = true

        state.temas.cen_titulo_bg                  = '#F8B106FF'
        state.temas.cen_titulo_dark                = false
        state.temas.cen_close_bg                   = '#B8B969FF'
        state.temas.cen_close_dark                 = true
        state.temas.cen_estado_vencehoy_bg         = '#D3E570FF'
        state.temas.cen_estado_vencehoy_dark       = true
        state.temas.cen_estado_finalizado_bg       = '#ACBA6BFF'
        state.temas.cen_estado_finalizado_dark     = true
        state.temas.cen_estado_avencer_bg          = '#959866FF'
        state.temas.cen_estado_avencer_dark        = false
        state.temas.cen_estado_vencido_bg          = '#BC8D48FF'
        state.temas.cen_estado_vencido_dark        = false
        state.temas.cen_estado_pendiente_bg        = '#EBE100FF'
        state.temas.cen_estado_pendiente_dark      = false
        state.temas.cen_estado_facturado_bg        = '#B58D4AFF'
        state.temas.cen_estado_facturado_dark      = true
        state.temas.cen_estado_enembalaje_bg       = '#A7BA60FF'
        state.temas.cen_estado_enembalaje_dark     = false
        state.temas.cen_estado_embalado_bg         = '#D4DE55FF'
        state.temas.cen_estado_embalado_dark       = false
        state.temas.cen_estado_enviado_bg          = '#D0C702FF'
        state.temas.cen_estado_enviado_dark        = false
        state.temas.cen_estado_anulado_bg          = '#F46767FF'
        state.temas.cen_estado_anulado_dark        = false
        state.temas.cen_estado_promocion_bg        = '#99C03DFF'        
        state.temas.cen_estado_promocion_dark      = false
        state.temas.cen_btns_bg                    = '#B8B969FF'
        state.temas.cen_btns_dark                  = true

      } else if (payload=='Invierno') {

        state.temas.forms_titulo_bg                = '#817F7BFF'
        state.temas.forms_titulo_dark              = true
        state.temas.forms_close_bg                 = '#FFFFFFFF'
        state.temas.forms_close_dark               = false

        state.temas.forms_btn_add_bg               = '#F48A1BFF'
        state.temas.forms_btn_add_dark             = true
        state.temas.forms_btn_xls_bg               = '#6AB918FF'
        state.temas.forms_btn_xls_dark             = true
        state.temas.forms_btn_pdf_bg               = '#1760ADFF'
        state.temas.forms_btn_pdf_dark             = true
        state.temas.forms_btn_activo_bg            = '#938DB6FF'
        state.temas.forms_btn_activo_dark          = true
        state.temas.forms_btn_inactivo_bg          = '#E0BFBCFF'
        state.temas.forms_btn_inactivo_dark        = false
        state.temas.forms_btn_editar_bg            = '#BBC0D6FF'
        state.temas.forms_btn_editar_dark          = false
        state.temas.forms_btn_borrar_bg            = '#EA8566FF'
        state.temas.forms_btn_borrar_dark          = true
        state.temas.forms_btn_activar_bg           = '#FFFFFFFF'
        state.temas.forms_btn_activar_dark         = false
        state.temas.forms_btn_print_bg             = '#9B928AFF'
        state.temas.forms_btn_print_dark           = true

        state.temas.notif_cprs_bg                  = '#9C9272FF'
        state.temas.notif_cprs_bg_dark             = true
        state.temas.notif_cprs_title_bg            = '#D1C52AFF'
        state.temas.notif_cprs_title_dark          = true
        state.temas.notif_cprs_text_bg             = '#9A9655FF'
        state.temas.notif_cprs_text_dark           = true
        state.temas.notif_cprs_btn_bg              = '#ABD449FF'
        state.temas.notif_cprs_btn_dark            = true

        state.temas.notif_pago_bg                  = '#9C9272FF'
        state.temas.notif_pago_bg_dark             = true
        state.temas.notif_pago_title_bg            = '#D1C52AFF'
        state.temas.notif_pago_title_dark          = true
        state.temas.notif_pago_text_bg             = '#9A9655FF'
        state.temas.notif_pago_text_dark           = true

        state.temas.notif_rechazo_bg               = '#FF00FFFF'
        state.temas.notif_rechazo_bg_dark          = false
        state.temas.notif_rechazo_title_bg         = '#FF0000'
        state.temas.notif_rechazo_title_dark       = false
        state.temas.notif_rechazo_text_bg          = '#FF00FFFF'
        state.temas.notif_rechazo_text_dark        = false

        state.temas.snack_ok_bg                    = '#647048FF'
        state.temas.snack_ok_dark                  = true
        state.temas.snack_error_bg                 = '#866C50FF'
        state.temas.snack_error_dark               = true

        state.temas.barra_principal_bg             = '#9C998FFF'
        state.temas.barra_principal_dark           = true
        state.temas.barra_principal_bell_bg        = '#F6FA00FF'
        state.temas.barra_principal_bell_dark      = true
        state.temas.barra_principal_sucursal_bg    = '#FFFFFFFF'
        state.temas.barra_principal_sucursal_dark  = false
        state.temas.barra_principal_botonapp_bg    = '#F8B106FF'
        state.temas.barra_principal_botonapp_dark  = true
        state.temas.barra_principal_empusr_bg      = '#69AC33FF'
        state.temas.barra_principal_empusr_dark    = false
        state.temas.barra_principal_profile_bg     = '#F8B106FF'
        state.temas.barra_principal_profile_dark   = false
        state.temas.barra_principal_salir_bg       = '#F8B106FF'
        state.temas.barra_principal_salir_dark     = false
        state.temas.barra_lateral_bg               = '#BBB9B2FF'
        state.temas.barra_lateral_dark             = true
        state.temas.barra_lateral_font             = '#695F06FF'

        state.temas.card_ventas_bg                 = '#D4CDC4FF'
        state.temas.card_ventas_dark               = true
        state.temas.card_compras_bg                = '#BBB4ACFF'
        state.temas.card_compras_dark              = true
        state.temas.card_acobrar_bg                = '#A19B93FF'
        state.temas.card_acobrar_dark              = true
        state.temas.card_apagar_bg                 = '#89847EFF'
        state.temas.card_apagar_dark               = true
        state.temas.card_valores_bg                = '#75706AFF'
        state.temas.card_valores_dark              = true
        state.temas.card_pedidos_bg                = '#5F5A55FF'
        state.temas.card_pedidos_dark              = true

        state.temas.cen_card_body_bg               = '#FFFFFFFF'
        state.temas.cen_card_body_dark             = false
        state.temas.cen_card_activo_bg             = '#6C060EFF'
        state.temas.cen_card_activo_dark           = true

        state.temas.cen_facturas_bg                = '#817971FF'
        state.temas.cen_facturas_dark              = true
        state.temas.cen_creditos_bg                = '#958D84FF'
        state.temas.cen_creditos_dark              = true
        state.temas.cen_debitos_bg                 = '#7D7B78FF'
        state.temas.cen_debitos_dark               = true
        state.temas.cen_presupuestos_bg            = '#9F9F9EFF'
        state.temas.cen_presupuestos_dark          = true
        state.temas.cen_remitos_bg                 = '#C1C0BFFF'
        state.temas.cen_remitos_dark               = true
        state.temas.cen_pedidos_bg                 = '#BEB3A7FF'
        state.temas.cen_pedidos_dark               = true
        state.temas.cen_recibos_bg                 = '#A39F9FFF'
        state.temas.cen_recibos_dark               = true
        state.temas.cen_gastos_bg                  = '#E3DFDAFF'
        state.temas.cen_gastos_dark                = true
        state.temas.cen_pagos_bg                   = '#E3DFDAFF'
        state.temas.cen_pagos_dark                 = true
        state.temas.cen_filtros_bg                 = '#B8B969FF'
        state.temas.cen_filtros_dark               = true

        state.temas.cen_titulo_bg                  = '#F8B106FF'
        state.temas.cen_titulo_dark                = false
        state.temas.cen_close_bg                   = '#B8B969FF'
        state.temas.cen_close_dark                 = true
        state.temas.cen_estado_vencehoy_bg         = '#D9E0B3FF'
        state.temas.cen_estado_vencehoy_dark       = false
        state.temas.cen_estado_finalizado_bg       = '#ACBA6BFF'
        state.temas.cen_estado_finalizado_dark     = true
        state.temas.cen_estado_avencer_bg          = '#959866FF'
        state.temas.cen_estado_avencer_dark        = false
        state.temas.cen_estado_vencido_bg          = '#BC8D48FF'
        state.temas.cen_estado_vencido_dark        = false
        state.temas.cen_estado_pendiente_bg        = '#909090FF'
        state.temas.cen_estado_pendiente_dark      = false
        state.temas.cen_estado_facturado_bg        = '#99C03DFF'
        state.temas.cen_estado_facturado_dark      = false
        state.temas.cen_estado_enembalaje_bg       = '#D4DE55FF'
        state.temas.cen_estado_enembalaje_dark     = false
        state.temas.cen_estado_embalado_bg         = '#D4DE55FF'
        state.temas.cen_estado_embalado_dark       = false
        state.temas.cen_estado_enviado_bg          = '#CA4649FF'
        state.temas.cen_estado_enviado_dark        = true
        state.temas.cen_estado_anulado_bg          = '#ABC395FF'
        state.temas.cen_estado_anulado_dark        = false
        state.temas.cen_estado_promocion_bg        = '#99C03DFF'        
        state.temas.cen_estado_promocion_dark      = false
        state.temas.cen_btns_bg                    = '#B8B969FF'
        state.temas.cen_btns_dark                  = true
        
      } else if (payload=='Primavera') {

        state.temas.forms_titulo_bg                = '#A3B686FF'
        state.temas.forms_titulo_dark              = true
        state.temas.forms_close_bg                 = '#FFFFFFFF'
        state.temas.forms_close_dark               = false

        state.temas.forms_btn_add_bg               = '#F48A1BFF'
        state.temas.forms_btn_add_dark             = true
        state.temas.forms_btn_xls_bg               = '#6AB918FF'
        state.temas.forms_btn_xls_dark             = true
        state.temas.forms_btn_pdf_bg               = '#1760ADFF'
        state.temas.forms_btn_pdf_dark             = true
        state.temas.forms_btn_activo_bg            = '#938DB6FF'
        state.temas.forms_btn_activo_dark          = true
        state.temas.forms_btn_inactivo_bg          = '#E0BFBCFF'
        state.temas.forms_btn_inactivo_dark        = false
        state.temas.forms_btn_editar_bg            = '#BBC0D6FF'
        state.temas.forms_btn_editar_dark          = false
        state.temas.forms_btn_borrar_bg            = '#EA8566FF'
        state.temas.forms_btn_borrar_dark          = true
        state.temas.forms_btn_activar_bg           = '#FFFFFFFF'
        state.temas.forms_btn_activar_dark         = false
        state.temas.forms_btn_print_bg             = '#9B928AFF'
        state.temas.forms_btn_print_dark           = true

        state.temas.notif_cprs_bg                  = '#9C9272FF'
        state.temas.notif_cprs_bg_dark             = false
        state.temas.notif_cprs_title_bg            = '#D1C52AFF'
        state.temas.notif_cprs_title_dark          = false
        state.temas.notif_cprs_text_bg             = '#9A9655FF'
        state.temas.notif_cprs_text_dark           = false
        state.temas.notif_cprs_btn_bg              = '#ABD449FF'
        state.temas.notif_cprs_btn_dark            = false

        state.temas.notif_pago_bg                  = '#C7D1E9FF'
        state.temas.notif_pago_bg_dark             = false
        state.temas.notif_pago_title_bg            = '#004AFDFF'
        state.temas.notif_pago_title_dark          = true
        state.temas.notif_pago_text_bg             = '#000000FF'
        state.temas.notif_pago_text_dark           = true

        state.temas.notif_rechazo_bg               = '#FF00FFFF'
        state.temas.notif_rechazo_bg_dark          = false
        state.temas.notif_rechazo_title_bg         = '#FF0000'
        state.temas.notif_rechazo_title_dark       = false
        state.temas.notif_rechazo_text_bg          = '#FF00FFFF'
        state.temas.notif_rechazo_text_dark        = false

        state.temas.snack_ok_bg                    = '#647048FF'
        state.temas.snack_ok_dark                  = true
        state.temas.snack_error_bg                 = '#866C50FF'
        state.temas.snack_error_dark               = true

        state.temas.barra_principal_bg             = '#5E8812FF'
        state.temas.barra_principal_dark           = true
        state.temas.barra_principal_bell_bg        = '#F6FA00FF'
        state.temas.barra_principal_bell_dark      = false
        state.temas.barra_principal_sucursal_bg    = '#DBD206FF'
        state.temas.barra_principal_sucursal_dark  = false
        state.temas.barra_principal_botonapp_bg    = '#DBD206FF'
        state.temas.barra_principal_botonapp_dark  = true
        state.temas.barra_principal_empusr_bg      = '#DBD206FF'
        state.temas.barra_principal_empusr_dark    = false
        state.temas.barra_principal_profile_bg     = '#DBD206FF'
        state.temas.barra_principal_profile_dark   = false
        state.temas.barra_principal_salir_bg       = '#DBD206FF'
        state.temas.barra_principal_salir_dark     = false
        state.temas.barra_lateral_bg               = '#80B4CCFF'
        state.temas.barra_lateral_dark             = true
        state.temas.barra_lateral_font             = '#695F06FF'

        state.temas.card_ventas_bg                 = '#03ADFBFF'
        state.temas.card_ventas_dark               = true
        state.temas.card_compras_bg                = '#4FBEEAFF'
        state.temas.card_compras_dark              = true
        state.temas.card_acobrar_bg                = '#1F98C8FF'
        state.temas.card_acobrar_dark              = true
        state.temas.card_apagar_bg                 = '#0779A6FF'
        state.temas.card_apagar_dark               = true
        state.temas.card_valores_bg                = '#3576D6FF'
        state.temas.card_valores_dark              = true
        state.temas.card_pedidos_bg                = '#0306FBFF'
        state.temas.card_pedidos_dark              = true

        state.temas.cen_card_body_bg               = '#D5DDE1FF'
        state.temas.cen_card_body_dark             = false
        state.temas.cen_card_activo_bg             = '#F62D03FF'
        state.temas.cen_card_activo_dark           = true

        state.temas.cen_facturas_bg                = '#ABC8F3FF'
        state.temas.cen_facturas_dark              = true
        state.temas.cen_creditos_bg                = '#86B5FBFF'
        state.temas.cen_creditos_dark              = true
        state.temas.cen_debitos_bg                 = '#74AAFAFF'
        state.temas.cen_debitos_dark               = true
        state.temas.cen_presupuestos_bg            = '#639FF8FF'
        state.temas.cen_presupuestos_dark          = true
        state.temas.cen_remitos_bg                 = '#4C90F4FF'
        state.temas.cen_remitos_dark               = true
        state.temas.cen_pedidos_bg                 = '#3482F4FF'
        state.temas.cen_pedidos_dark               = true
        state.temas.cen_recibos_bg                 = '#1B73F4FF'
        state.temas.cen_recibos_dark               = true
        state.temas.cen_gastos_bg                  = '#1B73F4FF'
        state.temas.cen_gastos_dark                = true
        state.temas.cen_pagos_bg                   = '#1B73F4FF'
        state.temas.cen_pagos_dark                 = true
        state.temas.cen_filtros_bg                 = '#F6CA03FF'
        state.temas.cen_filtros_dark               = false

        state.temas.cen_titulo_bg                  = '#F8B106FF'
        state.temas.cen_titulo_dark                = false
        state.temas.cen_close_bg                   = '#B8B969FF'
        state.temas.cen_close_dark                 = true
        state.temas.cen_estado_vencehoy_bg         = '#03ADFBFF'
        state.temas.cen_estado_vencehoy_dark       = false
        state.temas.cen_estado_finalizado_bg       = '#0020FFFF'
        state.temas.cen_estado_finalizado_dark     = true
        state.temas.cen_estado_avencer_bg          = '#81ABC3FF'
        state.temas.cen_estado_avencer_dark        = false
        state.temas.cen_estado_vencido_bg          = '#6494B0FF'
        state.temas.cen_estado_vencido_dark        = false
        state.temas.cen_estado_pendiente_bg        = '#4F99C5FF'
        state.temas.cen_estado_pendiente_dark      = false
        state.temas.cen_estado_facturado_bg        = '#81BAE9FF'
        state.temas.cen_estado_facturado_dark      = false
        state.temas.cen_estado_enembalaje_bg       = '#57BFD9FF'
        state.temas.cen_estado_enembalaje_dark     = false
        state.temas.cen_estado_embalado_bg         = '#117F9AFF'
        state.temas.cen_estado_embalado_dark       = false
        state.temas.cen_estado_enviado_bg          = '#0F83E3FF'
        state.temas.cen_estado_enviado_dark        = false
        state.temas.cen_estado_anulado_bg          = '#D9DE55FF'
        state.temas.cen_estado_anulado_dark        = false
        state.temas.cen_estado_promocion_bg        = '#99C03DFF'
        state.temas.cen_estado_promocion_dark      = false
        state.temas.cen_btns_bg                    = '#B8B969FF'
        state.temas.cen_btns_dark                  = true

      } else if (payload=='Verano') {

        state.temas.forms_titulo_bg                = '#00B2DFFF'
        state.temas.forms_titulo_dark              = true
        state.temas.forms_close_bg                 = '#FFFFFFFF'
        state.temas.forms_close_dark               = false

        state.temas.forms_btn_add_bg               = '#00B6FFFF' //'#F48A1BFF'
        state.temas.forms_btn_add_dark             = true
        state.temas.forms_btn_xls_bg               = '#6AB918FF'
        state.temas.forms_btn_xls_dark             = true
        state.temas.forms_btn_pdf_bg               = '#1760ADFF'
        state.temas.forms_btn_pdf_dark             = true
        state.temas.forms_btn_activo_bg            = '#84CACCFF'
        state.temas.forms_btn_activo_dark          = true
        state.temas.forms_btn_inactivo_bg          = '#E0BFBCFF'
        state.temas.forms_btn_inactivo_dark        = false
        state.temas.forms_btn_editar_bg            = '#BBC0D6FF'
        state.temas.forms_btn_editar_dark          = false
        state.temas.forms_btn_borrar_bg            = '#EA8566FF'
        state.temas.forms_btn_borrar_dark          = true
        state.temas.forms_btn_activar_bg           = '#FFFFFFFF'
        state.temas.forms_btn_activar_dark         = false
        state.temas.forms_btn_print_bg             = '#9B928AFF'
        state.temas.forms_btn_print_dark           = true

        state.temas.notif_cprs_bg                  = '#9C9272FF'
        state.temas.notif_cprs_bg_dark             = false
        state.temas.notif_cprs_title_bg            = '#D1C52AFF'
        state.temas.notif_cprs_title_dark          = false
        state.temas.notif_cprs_text_bg             = '#9A9655FF'
        state.temas.notif_cprs_text_dark           = false
        state.temas.notif_cprs_btn_bg              = '#ABD449FF'
        state.temas.notif_cprs_btn_dark            = false

        state.temas.notif_pago_bg                  = '#C7D1E9FF'
        state.temas.notif_pago_bg_dark             = false
        state.temas.notif_pago_title_bg            = '#004AFDFF'
        state.temas.notif_pago_title_dark          = true
        state.temas.notif_pago_text_bg             = '#000000FF'
        state.temas.notif_pago_text_dark           = true

        state.temas.notif_rechazo_bg               = '#FF00FFFF'
        state.temas.notif_rechazo_bg_dark          = false
        state.temas.notif_rechazo_title_bg         = '#FF0000'
        state.temas.notif_rechazo_title_dark       = false
        state.temas.notif_rechazo_text_bg          = '#FF00FFFF'
        state.temas.notif_rechazo_text_dark        = false

        state.temas.snack_ok_bg                    = '#647048FF'
        state.temas.snack_ok_dark                  = true
        state.temas.snack_error_bg                 = '#866C50FF'
        state.temas.snack_error_dark               = true

        state.temas.barra_principal_bg             = '#00B2DFFF'
        state.temas.barra_principal_dark           = true
        state.temas.barra_principal_bell_bg        = '#FFFFFFFF'
        state.temas.barra_principal_bell_dark      = false
        state.temas.barra_principal_sucursal_bg    = '#FFFFFFFF'
        state.temas.barra_principal_sucursal_dark  = false
        state.temas.barra_principal_botonapp_bg    = '#FFFFFFFF'
        state.temas.barra_principal_botonapp_dark  = true
        state.temas.barra_principal_empusr_bg      = '#FFFFFFFF'
        state.temas.barra_principal_empusr_dark    = false
        state.temas.barra_principal_profile_bg     = '#FFFFFFFF'
        state.temas.barra_principal_profile_dark   = false
        state.temas.barra_principal_salir_bg       = '#FFFFFFFF'
        state.temas.barra_principal_salir_dark     = false
        state.temas.barra_lateral_bg               = '#80B4CCFF'
        state.temas.barra_lateral_dark             = true
        state.temas.barra_lateral_font             = '#695F06FF'

        state.temas.card_ventas_bg                 = '#00B2DFFF'
        state.temas.card_ventas_dark               = true
        state.temas.card_compras_bg                = '#00B2DFFF'
        state.temas.card_compras_dark              = true
        state.temas.card_acobrar_bg                = '#00B2DFFF'
        state.temas.card_acobrar_dark              = true
        state.temas.card_apagar_bg                 = '#00B2DFFF'
        state.temas.card_apagar_dark               = true
        state.temas.card_valores_bg                = '#00B2DFFF'
        state.temas.card_valores_dark              = true
        state.temas.card_pedidos_bg                = '#00B2DFFF'
        state.temas.card_pedidos_dark              = true

        state.temas.cen_card_body_bg               = '#D5DDE1FF'
        state.temas.cen_card_body_dark             = false
        state.temas.cen_card_activo_bg             = '#F62D03FF'
        state.temas.cen_card_activo_dark           = true

        state.temas.cen_facturas_bg                = '#00B2DFFF'
        state.temas.cen_facturas_dark              = true
        state.temas.cen_creditos_bg                = '#00B2DFFF'
        state.temas.cen_creditos_dark              = true
        state.temas.cen_debitos_bg                 = '#00B2DFFF'
        state.temas.cen_debitos_dark               = true
        state.temas.cen_presupuestos_bg            = '#00B2DFFF'
        state.temas.cen_presupuestos_dark          = true
        state.temas.cen_remitos_bg                 = '#00B2DFFF'
        state.temas.cen_remitos_dark               = true
        state.temas.cen_pedidos_bg                 = '#00B2DFFF'
        state.temas.cen_pedidos_dark               = true
        state.temas.cen_recibos_bg                 = '#00B2DFFF'
        state.temas.cen_recibos_dark               = true
        state.temas.cen_gastos_bg                  = '#00B2DFFF'
        state.temas.cen_gastos_dark                = true
        state.temas.cen_pagos_bg                   = '#00B2DFFF'
        state.temas.cen_pagos_dark                 = true
        state.temas.cen_filtros_bg                 = '#F6CA03FF'
        state.temas.cen_filtros_dark               = false

        state.temas.cen_titulo_bg                  = '#F8B106FF'
        state.temas.cen_titulo_dark                = false
        state.temas.cen_close_bg                   = '#B8B969FF'
        state.temas.cen_close_dark                 = true
        state.temas.cen_estado_vencehoy_bg         = '#03ADFBFF'
        state.temas.cen_estado_vencehoy_dark       = false
        state.temas.cen_estado_finalizado_bg       = '#00B2DFFF'
        state.temas.cen_estado_finalizado_dark     = true
        state.temas.cen_estado_avencer_bg          = '#81ABC3FF'
        state.temas.cen_estado_avencer_dark        = false
        state.temas.cen_estado_vencido_bg          = '#6494B0FF'
        state.temas.cen_estado_vencido_dark        = false
        state.temas.cen_estado_pendiente_bg        = '#4F99C5FF'
        state.temas.cen_estado_pendiente_dark      = true
        state.temas.cen_estado_facturado_bg        = '#81BAE9FF'
        state.temas.cen_estado_facturado_dark      = true
        state.temas.cen_estado_enembalaje_bg       = '#57BFD9FF'
        state.temas.cen_estado_enembalaje_dark     = true
        state.temas.cen_estado_embalado_bg         = '#117F9AFF'
        state.temas.cen_estado_embalado_dark       = true
        state.temas.cen_estado_enviado_bg          = '#0F83E3FF'
        state.temas.cen_estado_enviado_dark        = true
        state.temas.cen_estado_anulado_bg          = '#D9DE55FF'
        state.temas.cen_estado_anulado_dark        = false
        state.temas.cen_estado_promocion_bg        = '#99C03DFF'        
        state.temas.cen_estado_promocion_dark      = false
        state.temas.cen_btns_bg                    = '#0076FFFF'
        state.temas.cen_btns_dark                  = true
        
      } else if (payload=='Pastel') {

        state.temas.forms_titulo_bg                = '#C9D498FF'
        state.temas.forms_titulo_dark              = true
        state.temas.forms_close_bg                 = '#A577A5FF'
        state.temas.forms_close_dark               = false

        state.temas.forms_btn_add_bg               = '#F48A1BFF'
        state.temas.forms_btn_add_dark             = true
        state.temas.forms_btn_xls_bg               = '#6AB918FF'
        state.temas.forms_btn_xls_dark             = true
        state.temas.forms_btn_pdf_bg               = '#1760ADFF'
        state.temas.forms_btn_pdf_dark             = true
        state.temas.forms_btn_activo_bg            = '#938DB6FF'
        state.temas.forms_btn_activo_dark          = true
        state.temas.forms_btn_inactivo_bg          = '#E0BFBCFF'
        state.temas.forms_btn_inactivo_dark        = false
        state.temas.forms_btn_editar_bg            = '#BBC0D6FF'
        state.temas.forms_btn_editar_dark          = false
        state.temas.forms_btn_borrar_bg            = '#EA8566FF'
        state.temas.forms_btn_borrar_dark          = true
        state.temas.forms_btn_activar_bg           = '#FFFFFFFF'
        state.temas.forms_btn_activar_dark         = false
        state.temas.forms_btn_print_bg             = '#9B928AFF'
        state.temas.forms_btn_print_dark           = true

        state.temas.notif_cprs_bg                  = '#B9D6CFFF'
        state.temas.notif_cprs_bg_dark             = false
        state.temas.notif_cprs_title_bg            = '#83D6C1FF'
        state.temas.notif_cprs_title_dark          = false
        state.temas.notif_cprs_text_bg             = '#9A9655FF'
        state.temas.notif_cprs_text_dark           = false
        state.temas.notif_cprs_btn_bg              = '#ABD449FF'
        state.temas.notif_cprs_btn_dark            = false

        state.temas.notif_pago_bg                  = '#C0ABABFF'
        state.temas.notif_pago_bg_dark             = false
        state.temas.notif_pago_title_bg            = '#BEC87AFF'
        state.temas.notif_pago_title_dark          = true
        state.temas.notif_pago_text_bg             = '#9A9655FF'
        state.temas.notif_pago_text_dark           = false

        state.temas.notif_rechazo_bg               = '#DCA7A7FF'
        state.temas.notif_rechazo_bg_dark          = false
        state.temas.notif_rechazo_title_bg         = '#F16464FF'
        state.temas.notif_rechazo_title_dark       = true
        state.temas.notif_rechazo_text_bg          = '#DCA7A7FF'
        state.temas.notif_rechazo_text_dark        = false

        state.temas.snack_ok_bg                    = '#647048FF'
        state.temas.snack_ok_dark                  = true
        state.temas.snack_error_bg                 = '#866C50FF'
        state.temas.snack_error_dark               = true

        state.temas.barra_principal_bg             = '#A58ABBFF'
        state.temas.barra_principal_dark           = true
        state.temas.barra_principal_bell_bg        = '#DBD206FF'
        state.temas.barra_principal_bell_dark      = false
        state.temas.barra_principal_sucursal_bg    = '#DBD206FF'
        state.temas.barra_principal_sucursal_dark  = false
        state.temas.barra_principal_botonapp_bg    = '#DBD206FF'
        state.temas.barra_principal_botonapp_dark  = true
        state.temas.barra_principal_empusr_bg      = '#DBD206FF'
        state.temas.barra_principal_empusr_dark    = false
        state.temas.barra_principal_profile_bg     = '#DBD206FF'
        state.temas.barra_principal_profile_dark   = false
        state.temas.barra_principal_salir_bg       = '#DBD206FF'
        state.temas.barra_principal_salir_dark     = false
        state.temas.barra_lateral_bg               = '#A58ABBFF'
        state.temas.barra_lateral_dark             = true
        state.temas.barra_lateral_font             = '#695F06FF'

        state.temas.card_ventas_bg                 = '#756583FF'
        state.temas.card_ventas_dark               = true
        state.temas.card_compras_bg                = '#6E5881FF'
        state.temas.card_compras_dark              = true
        state.temas.card_acobrar_bg                = '#6B4C84FF'
        state.temas.card_acobrar_dark              = true
        state.temas.card_apagar_bg                 = '#643E84FF'
        state.temas.card_apagar_dark               = true
        state.temas.card_valores_bg                = '#5E3084FF'
        state.temas.card_valores_dark              = true
        state.temas.card_pedidos_bg                = '#572383FF'
        state.temas.card_pedidos_dark              = true

        state.temas.cen_card_body_bg               = '#D5DDE1FF'
        state.temas.cen_card_body_dark             = false
        state.temas.cen_card_activo_bg             = '#F62D03FF'
        state.temas.cen_card_activo_dark           = true

        state.temas.cen_facturas_bg                = '#BEAECCFF'
        state.temas.cen_facturas_dark              = true
        state.temas.cen_creditos_bg                = '#B494CFFF'
        state.temas.cen_creditos_dark              = true
        state.temas.cen_debitos_bg                 = '#AA7ECFFF'
        state.temas.cen_debitos_dark               = true
        state.temas.cen_presupuestos_bg            = '#9D66CAFF'
        state.temas.cen_presupuestos_dark          = true
        state.temas.cen_remitos_bg                 = '#8F47CAFF'
        state.temas.cen_remitos_dark               = true
        state.temas.cen_pedidos_bg                 = '#7E23CAFF'
        state.temas.cen_pedidos_dark               = true
        state.temas.cen_recibos_bg                 = '#760DCDFF'
        state.temas.cen_recibos_dark               = true
        state.temas.cen_gastos_bg                  = '#760DCDFF'
        state.temas.cen_gastos_dark                = true
        state.temas.cen_pagos_bg                   = '#760DCDFF'
        state.temas.cen_pagos_dark                 = true
        state.temas.cen_filtros_bg                 = '#F6CA03FF'
        state.temas.cen_filtros_dark               = false

        state.temas.cen_titulo_bg                  = '#F8B106FF'
        state.temas.cen_titulo_dark                = false
        state.temas.cen_close_bg                   = '#B8B969FF'
        state.temas.cen_close_dark                 = true
        state.temas.cen_estado_vencehoy_bg         = '#EA9236FF'
        state.temas.cen_estado_vencehoy_dark       = true
        state.temas.cen_estado_finalizado_bg       = '#ACBA6BFF'
        state.temas.cen_estado_finalizado_dark     = true
        state.temas.cen_estado_avencer_bg          = '#959866FF'
        state.temas.cen_estado_avencer_dark        = true
        state.temas.cen_estado_vencido_bg          = '#BC8D48FF'
        state.temas.cen_estado_vencido_dark        = true
        state.temas.cen_estado_pendiente_bg        = '#FF4700A2'
        state.temas.cen_estado_pendiente_dark      = true
        state.temas.cen_estado_facturado_bg        = '#4FA00CA6'
        state.temas.cen_estado_facturado_dark      = true
        state.temas.cen_estado_enembalaje_bg       = '#936CA0FF'
        state.temas.cen_estado_enembalaje_dark     = true
        state.temas.cen_estado_embalado_bg         = '#74567EFF'
        state.temas.cen_estado_embalado_dark       = true
        state.temas.cen_estado_enviado_bg          = '#DB5454FF'
        state.temas.cen_estado_enviado_dark        = true
        state.temas.cen_estado_anulado_bg          = '#D4DE55FF'
        state.temas.cen_estado_anulado_dark        = true
        state.temas.cen_estado_promocion_bg        = '#99C03DFF'
        state.temas.cen_estado_promocion_dark      = true
        state.temas.cen_btns_bg                    = '#B8B969FF'
        state.temas.cen_btns_dark                  = true

      }
    },
  },

  getters: {
    //sucursal: state => state.sucursal,
    //sucursalFiscal: state => state.sucursalFiscal,
    //sucursales: state => state.sucursales,
    //caja: state => state.caja,
    //level: state => state.level,
    //notificaciones: state => state.notificaciones,
  },

  plugins: [
    //createPersistedState(),
  ],

});
