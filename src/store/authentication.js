/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-named-as-default-member
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';
import router from '../router';
// eslint-disable-next-line import/no-cycle
import HTTP from '../http';
// import { atanh } from 'core-js/core/number';

export default {
  /* eslint-disable */
  namespaced: true,
  state: {
    registerUsername: '',
    registerEmail: '',
    registerEmailRecomendo: '',
    registerPassword: '',
    registerError: null,
    registerTipo: null,
    loginEmail: '',
    loginPassword: '',
    loginUserId: '',
    loginError: null,
    token: null,
  },
  computed: {

    // EN REALIDAD, CUANDO SE LOGUEA UN USUARIO, DEBERIA CARGAR EN UN OBJETO
    // TODOS SUS DATOS DE UNA SOLA VEZ Y LISTO. PERO ESO CUANDO LO NECESITE.

    ...mapState(
      [
        'externo',
        'sucursal',
        'sucursales',
        'sucursalFiscal',
        'sucursalDemo',
        'carrusel',
        'avatar',
        'tema',
        'temas',
        'logotipo',
        'notificaciones',
        'caja',
        'vinculosPadres',
        'vinculosHijos',
        'tipo',
        'empresa',
        'rubros',
        'responsable',
        'cuit',
        'operario',
        'operarioId',
        'level',
        'porRem',
        'activo',
      ]),
  },
  methods: {
    ...mapMutations(
      [
        'setAnclarCostos',
        'setExterno',
        'setInicial',
        'setSucursal',
        'setSucursales',
        'setSucursalDemo',
        'setCarrusel',
        'setSucursalFiscal',
        'setSucursalManual',
        'setAvatar',
        'setTema',
        'setTemas',
        'setLogotipo',
        'setNotificaciones',
        'setCaja',
        'setVinculosPadres',
        'setTipo',
        'setEmpresa',
        'setTercero',
        'setRubros',
        'setResponsable',
        'setCuit',
        'setOperario',
        'setOperarioId',
        'setLevel',
        'setActivo',
        'setPorRem',
      ]),
  },





  actions: {
    logout({ commit }) {
      commit('setAnclarCostos', false, { root: true })
      commit('setExterno', false, { root: true })
      commit('setInicial', false, { root: true })
      commit('setToken', null );
      commit('setSucursal', null, { root: true })
      commit('setSucursales', null, { root: true })
      commit('setSucursalDemo', null, { root: true })
      commit('setSucursalFiscal', null, { root: true })
      commit('setAvatar', null, { root: true} )
      commit('setTema', null, { root: true} )
      commit('setTemas', null, { root: true} )
      commit('setLogotipo', null, { root: true} )
      commit('setVinculosPadres', null, { root: true })
      commit('setVinculosHijos', null, { root: true })
      commit('setNotificaciones', null, { root: true })
      commit('setNotificacionesgohu', null, { root: true })
      commit('setEmpresa', null, { root: true })
      commit('setTercero', null, { root: true })
      commit('setRubros', null, { root: true })
      commit('setResponsable', null, { root: true })
      commit('setCuit', null, { root: true })
      commit('setOperario', null, { root: true })
      commit('setOperarioId', null, { root: true })
      commit('setDatosPanel', {
        ventasDelDia:         0,
        ventasCttCbtesDelDia: 0,
        ventasDelMes:         0,
        ventasCttCbtesDelMes: 0,
        debAVencer:           0,
        debVencidos:          0,
        anotador:             0,
        pedCantidad:          0,
        pedTotal:             0,
      }, { root: true });      

      router.push('/login');
    },

    register({ commit, state }) {
      commit('setRegisterError', null);
      return HTTP().post('/auth/register', {
        username: state.registerUsername,
        email: state.registerEmail,
        password: state.registerPassword,
        tipo: state.registerTipo,
        recomendo: state.registerEmailRecomendo,
      }).then(({ data }) => {
        if (data!='error' && data!='El mail del usuario que recomendo no existe!') {
          commit('setToken', data.token);
          router.push('/Login');
        }
      })
      .catch((e) => {
        commit('setRegisterError', 'Ha ocurrido un error al crear la cuenta.');
      });
    },

    login({ commit, state }) {
      //let tipo = ''       // TIPO DE USUARIO
      let operario = ''   // OPERARIO
      let operarioId = '' // OPERARIO ID
      let tema = ''       // TEMA
     
      commit('setLoginError', null );
      commit('setRegisterError', null );

      return HTTP().post('/auth/login', {
        email: state.loginEmail,
        password: state.loginPassword,
        uid: null,
        
        }).then(({ data }) => {

          if (data=='error') {
            commit('setLoginError', 'Las credenciales no son válidas!')
            router.push('/Login')
            return
          }

          debugger

          if (moment(data.vencimiento).format()<moment().format('YYYY-MM-DD')) {
            commit('setLoginError', 'La cuenta esta bloqueda!')
            router.push('/Login')
            return
          }

          commit('setToken', data.token);
          commit('setExterno', false, { root: true });
          commit('setAnclarCostos', false, { root: true })
          commit('setInicial', false, { root: true });
          commit('setLoginUserId', data.id);
          commit('setEmpresa', null, { root: true })
          commit('setEmpresaId', null, { root: true })
          commit('setAvatar', data.avatar, { root: true })
          commit('setTema', null, { root: true} )
          commit('setTemas', null, { root: true} )
          commit('setTercero', null, { root: true })
          commit('setOperario', null, { root: true })
          commit('setOperarioId', null, { root: true })
          commit('setLevel', data.level, { root: true })
          commit('setResponsable', null, { root: true })
          commit('setCuit', null, { root: true })
          commit('setActivo', data.activo, { root: true })
          commit('setNotificaciones', null, { root: true })
          commit('setNotificacionesgohu', null, { root: true })
          commit('setTipo', 'UE', { root: true })
          commit('setPorRem', null, { root: true })
          commit('setVinculosPadres', [], { root: true })
          commit('setVinculosHijos', [], { root: true })
          commit('setCarrusel', [], { root: true })
          commit('setProveedores', [], { root: true })
          commit('setRoles', [], { root: true })
          commit('setContadorBloqueado', false, { root: true })
          commit('setHayCarrito', false, { root: true })
          commit('setDatosPanel', {
            ventasDelDia:         0,
            ventasCttCbtesDelDia: 0,
            ventasDelMes:         0,
            ventasCttCbtesDelMes: 0,
            comprasDelMes:        0,
            gastosDelMes:         0,
            debAVencer:           0,
            debVencidos:          0,
            anotador:             0,
            pedCantidad:          0,
            pedTotal:             0,
          }, { root: true });

          commit('setDatosEmpresa', {
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
            pathDocs:             '',
          } , { root: true });

          commit('setTemas', {
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
            notif_cprs_dark: '',
            notif_cprs_title_bg: '',
            notif_cprs_titie_dark: '',
            notif_cprs_text_bg: '',
            notif_cprs_text_dark: '',
            notif_cprs_btn_bg: '',
            notif_cprs_btn_dark: '',
    
            snack_ok_bg: '',
            snack_ok_dark: '',
            snack_error_bg: '',
            snack_error_dark: '',
    
            barra_principal_bg: '',
            barra_principal_dark: '',
            barra_principal_bell_bg: '',
            barra_principal_bell_dark: '',
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
            barra_lateral_font: '',

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
    
            cen_card_body_bg: '',
            cen_card_body_dark: '',
            cen_card_activo_bg: '',
            cen_card_activo_body_bg: '',
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
            cen_estado_finalizado_bg: '',
            cen_estado_finalizado_dark: '',
            cen_estado_avencer_bg: '',
            cen_estado_avencer_dark: '',
            cen_estado_vencido_bg: '',
            cen_estado_vencido_dark: '',
            cen_estado_pendiente_bg: '',
            cen_estado_pendiente_dark: '',
            cen_btns_bg: '',
            cen_btns_dark: '',

          }, { root: true });
            
          //tipo = data.tipo    // TIPO DE USUARIO

          /*
          Que tipos de usuarios se pueden logear?
          1) Supervisor
              podra realizar tareas de mantenimiento

          2) Usuario GOHU
              usuario normal de gohu + gohuerp

          3) Empleados de usuarios GOHU
              igual que opcion 2 pero con posibles restricciones del supervisor de la empresa.

          4) Clientes de usuarios GOHU
              solo podran consultar precios y realizar pedidos

          5) Publico en general
              podran publicar articulos, comprar y vender.
          
          */
        
          // AGREGO LOS ARTICULOS VINCULADOS AL STORE
          // NO HAGO RETURN ACA, VER SI DA PROBLEMAS

          let vinItems = []
          //vinItems.push(data.id)

          commit('setExterno', data.externo==1 ? true : false, { root: true })
          commit('setAnclarCostos', data.anclarcostos==1 ? true : false, { root: true })
          commit('setInicial', data.inicial==1 ? true : false, { root: true })
          commit('setTipo', data.tipo, { root: true })

          let tipo   = data.tipo
          let uid    = data.id

          if (!data.activo) {

            commit('setTipo', data.tipo , { root: true })
            router.push('/');

          } else {

            debugger
            return HTTP().post('/inicio', {tipo: tipo, uid: uid}).then(({ data }) => {    // vinculospadres

              debugger
                
              commit('setVinculosPadres' , data.setVinculosPadres, { root: true });
              commit('setVinculosHijos'  , data.setVinculosHijos, { root: true });
  
              let losProv = []
              if (data.setOperarioVendedor==false) {
                losProv.push({
                  avatar: 'Sin Avatar.jpg',
                  id: 0,
                  nombre: 'SIN SELECCIONAR',
                  preciosconiva: 0,
                  tercero_id: null
                })
              }

              for (let i=0; i<= data.setProveedores.length-1; i++) {
                losProv.push(data.setProveedores[i])
              }
              if (data.setOperarioVendedor) {
                data.setProveedores[0].esOperarioVendedor = true
              }
              commit('setProveedor'             , losProv[0] , { root: true})
              commit('setProveedores'           , losProv , { root: true})
              commit('setRubros'                , data.setRubros, { root: true })
  
              // si viene null es porque todavia no se termino de configurar ( es UG o UE )
              if (data.setTipo!=null) {
                commit('setTipo'                  , data.setTipo , { root: true })
              }
              commit('setPorRem'                , data.setPorRem , { root: true })
              commit('setTimeoutRefresh'        , data.setTimeoutRefresh , { root: true})
              commit('setPublicarPreciosConIVA' , data.setPublicarPreciosConIVA , { root: true})
              commit('setResponsable'           , data.setResponsable, { root: true })
              commit('setCuit'                  , data.setCuit, { root: true })
              commit('setDatosEmpresa'          , data.setDatosEmpresa, { root: true} )
              commit('setOperario'              , data.setOperario, { root: true })
              commit('setOperarioVendedor'      , data.setOperarioVendedor, { root: true })
              commit('setOperarioTerceroId'     , data.setOperarioTerceroId, { root: true })
              commit('setOperarioId'            , data.setOperarioId, { root: true })
              commit('setLoginUserId'           , data.setLoginUserId )
              commit('setEmpresa'               , data.setEmpresa, { root: true })
              commit('setTercero'               , data.setTercero, { root: true })
              commit('setSucursal'              , data.setSucursal, { root: true })
              commit('setSucursales'            , data.setSucursales, { root: true })
              commit('setSucursalDemo'          , data.setSucursalDemo, { root: true })
              commit('setSucursalFiscal'        , data.setSucursalFiscal, { root: true })
              commit('setSucursalManual'        , data.setSucursalManual, { root: true })
              commit('setLogotipo'              , data.setLogotipo, { root: true })
              commit('setTema'                  , data.setTema, { root: true })
              commit('setTemas'                 , data.setTemas, { root: true })
              commit('setCaja'                  , data.setCaja, { root: true } );
              commit('setRoles'                 , data.setRoles, { root: true })
  
              router.push('/');
  
            })

          }

              
      }).catch(() => {commit('setLoginError', 'Ha ocurrido un error en /auth/login')})
    }
  },





  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },





    userName(state) {
      return state.loginEmail;
    },





    userId(state) {
      return state.loginUserId;
    },




  },





  mutations: {
    setToken(state, token) {
      state.token = token;
    },





    setRegisterError(state, error) {
      state.registerError = error;
    },





    setRegisterUsername(state, username) {
      state.registerUsername = username;
    },





    setRegisterEmail(state, email) {
      state.registerEmail = email;
    },





    setRegisterEmailRecomendo(state, email) {
      state.registerEmailRecomendo = email;
    },




    setRegisterPassword(state, password) {
      state.registerPassword = password;
    },





    setRegisterTipo(state, tipo) {
      state.registerTipo = tipo;
    },





    setRegisterUserId(state, id) {
      state.registerUserId = id;
    },





    setLoginError(state, error) {
      state.loginError = error;
    },





    setLoginUsername(state, email) {
      state.loginEmail = email;
    },





    setLoginUserId(state, id) {
      state.loginUserId = id;
    },





    setLoginEmail(state, email) {
      state.loginEmail = email;
    },





    setLoginPassword(state, password) {
      state.loginPassword = password;
    },

  },
};
