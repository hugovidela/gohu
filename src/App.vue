<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp" app
      v-show="isLoggedIn && activo"
      :dark="temas.barra_lateral_dark==true"
      :color="temas.barra_lateral_bg" expand-on-hover>
      <!-- si pongo 'temporary' al seleccionar opcion se cierra el navigator -->

      <v-list dense>
        <v-list-group v-show="ophab(2)"
          no-action prepend-icon="mdi-airplane-takeoff"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>Ventas</v-list-item-title>
          </template>
          <v-list-item v-show="userId==1"
            link :to="{name: 'licencias'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-sale</v-icon>
              Licencias
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="userId==1"
            link :to="{name: 'estadisticas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-chart-bar</v-icon>
              Estadísticas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(4)"
            link :to="{name: 'ventas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-airplane-takeoff</v-icon>
              Central de Ventas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(3)"
            link :to="{name: 'usersclientes', key: 'C'}"
            @click="setTercero('C')"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-account-multiple</v-icon>
              Clientes
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(12)"
            link :to="{name: 'resumenesclientes'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-format-align-right</v-icon>
              Resumen de Cuentas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(13)"
            link :to="{name: 'saldosinicialesclientes'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-spellcheck</v-icon>
              Saldos Iniciales
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(14)"
            link :to="{name: 'usersequipo', key: 'V'}"
            @click="setTercero('V')"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-account-multiple</v-icon>
              Mi Equipo
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(92)"
            link :to="{name: 'userstransportistas', key: 'T'}"
            @click="setTercero('T')"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-truck</v-icon>
              Transportistas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(93)"
            link :to="{name: 'userspuntosderetiros', key: 'R'}"
            @click="setTercero('R')"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-clipboard-account</v-icon>
              Puntos de Retiros
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(96)"
            link :to="{name: 'comisiones'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-margin</v-icon>
              Comisiones
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(15)"
            link :to="{name: 'informesdeventas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-format-align-right</v-icon>
              Informes de Ventas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(101) && userId!=1)"
            link :to="{name: 'clientestags'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>verified_user</v-icon>
              Tags
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <!-- debe habilitar pedidos cuando: es externo y es minorista -->
        <v-list-item v-show="(externo && tipo=='MD')"
          link :to="{name: 'usersclientes', key: 'C'}"
          @click="setTercero('C')"
          :color="temas.barra_lateral_font">
          <v-list-item-title>
            <v-icon>mdi-account-multiple</v-icon>
            Clientes
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-show="externo && tipo=='MI'"
          link :to="{name:'compras'}"
          :color="temas.barra_lateral_font">
          <v-list-item-title>
            <v-icon>mdi-qrcode</v-icon>
            Pedidos
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-show="externo && tipo=='MD'"
          link :to="{name:'ventas'}"
          :color="temas.barra_lateral_font">
          <v-list-item-title>
            <v-icon>mdi-qrcode</v-icon>
            Pedidos
          </v-list-item-title>
        </v-list-item>

        <v-list-group  v-show="ophab(26)"
          no-action prepend-icon="mdi-airplane-landing"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>Compras</v-list-item-title>
          </template>
          <v-list-item v-show="ophab(28)"
            link :to="{name:'compras'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-airplane-landing</v-icon>
              Central de Compras
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(27)"
            link :to="{name: 'usersproveedores', key: 'P'}"
            :color="temas.barra_lateral_font"
            @click="setTercero('P')">
            <v-list-item-title>
              <v-icon>mdi-account-multiple</v-icon>
              Proveedores Mercaderías
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(27)"
            link :to="{name: 'userstercerosgastos', key: 'G'}"
            :color="temas.barra_lateral_font"
            @click="setTercero('G')">
            <v-list-item-title>
              <v-icon>mdi-account-multiple</v-icon>
              Estado/Servicios/Otros
            </v-list-item-title>
          </v-list-item>
          <v-list-item  v-show="ophab(37)"
            link :to="{name: 'resumenesproveedores'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-format-align-right</v-icon>
              Resumen de Cuentas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(38)"
            link :to="{name: 'saldosinicialesproveedores'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-spellcheck</v-icon>
              Saldos Iniciales
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(39)"
            link :to="{name: 'informesdecompras'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-format-align-right</v-icon>
              Informes de Compras
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group v-show="ophab(45) || (externo)"
          no-action prepend-icon="mdi-barcode"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>Artículos</v-list-item-title>
          </template>
          <v-list-item v-show="ophab(46) || (externo)" link :to="{name: 'articulos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-barcode</v-icon>
              Articulos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(47) || (externo && tipo!='MI')) && userId!=1"
            link :to="{name: 'precioscambios'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-marker</v-icon>
              Cambios de Precios
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(48) || (externo)) && userId!=1"
            link :to="{name: 'cambiosmasivosdearticulos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-drawing</v-icon>
              Cambios Masivos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(49) || externo) && userId!=1"
            link :to="{name: 'preciosconsultas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-glasses</v-icon>
              Consultas de Precios
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(93) || externo && tipo!='MI') && userId!=1"
            link :to="{name: 'publicaciones'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-web</v-icon>
              Publicaciones
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(94) || !externo && tipo!='MI') && userId!=1"
            link :to="{name: 'reglas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-square-root</v-icon>
              Reglas de Precios
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(52) && !externo) && userId!=1"
            link :to="{name: 'unidades'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-backburger</v-icon>
              Unidades de Medida
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(53) && !externo) && userId!=1"
            link :to="{name: 'caracteristicas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-shape-outline</v-icon>
              Caracteristicas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(54) || externo && tipo!='MI') && userId!=1"
            link :to="{name: 'marcas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-apple</v-icon>
              Marcas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(55) || externo && tipo!='MI') && userId!=1"
            link :to="{name: 'grupos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-code-parentheses</v-icon>
              Grupos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(56) || externo && tipo!='MI') && userId!=1"
            link :to="{name: 'preciostags'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>verified_user</v-icon>
              Tags
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="(ophab(57) || externo && tipo!='MI') && userId!=1"
            link :to="{name: 'informesdearticulos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-file-pdf-box</v-icon>
              Informes
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group v-show="(ophab(59) && !externo) && userId!=1"
          no-action prepend-icon="mdi-stocking"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>Stocks</v-list-item-title>
          </template>
          <v-list-item v-show="ophab(60)" link :to="{name: 'stocks'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-table-column</v-icon>
              Central de Stocks
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(63)" link :to="{name: 'informesdestocks'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-file-pdf-box</v-icon>
              Informes
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group v-show="ophab(67) && !externo" no-action prepend-icon="mdi-currency-usd"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>Tesoreria</v-list-item-title>
          </template>

          <v-list-item v-show="ophab(68) && activo" link :to="{name: 'tesoreriacaja'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-currency-usd</v-icon>
              Cajas
            </v-list-item-title>
          </v-list-item>

          <v-list-item v-show="ophab(69) && activo" link :to="{name: 'cheques'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-calendar</v-icon>
              Cheques
            </v-list-item-title>
          </v-list-item>

          <v-list-item  v-show="ophab(70) && activo" link :to="{name: 'informesdetesoreria'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-file-pdf-box</v-icon>
              Informes de Tesorería
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group
          v-show="ophab(73) && !externo && !sucursalDemo" no-action prepend-icon="mdi-bank"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>Bancos</v-list-item-title>
          </template>

          <v-list-item  v-show="ophab(74) && activo" link :to="{name: 'bancosmovimientos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-tab-plus</v-icon>
              Central de Bancos
            </v-list-item-title>
          </v-list-item>
          <v-list-item  v-show="ophab(92) && activo" link :to="{name: 'cotizacionmonedas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-currency-usd</v-icon>
              Cotización de Monedas
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group v-show="ophab(75) && !externo" no-action prepend-icon="mdi-home-account"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>AFIP</v-list-item-title>
          </template>
          <v-list-item v-show="ophab(95)" link :to="{name:'posIVA'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-percent</v-icon>
              Posición del IVA
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(76)" link :to="{name:'afipiva'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-percent</v-icon>
              Códigos de IVA
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(77)" link :to="{name:'afipoperaciones'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-credit-card-scan</v-icon>
              Operaciones
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(78)" link :to="{name:'afipcomprobantes'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-note-outline</v-icon>
              Comprobantes
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(79)" link :to="{name:'afipmonedas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-currency-jpy</v-icon>
              Monedas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(80)" link :to="{name:'afipdocumentos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-note-multiple</v-icon>
              Documentos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(81)" link :to="{name:'afipresponsables'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-pencil-lock</v-icon>
              Tipo de Responsables
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group v-show="ophab(82) || (externo && tipo=='MD')"
          no-action prepend-icon="mdi-dice-multiple"
          :color="temas.barra_lateral_font">
          <template v-slot:activator>
            <v-list-item-title>Configuracion</v-list-item-title>
          </template>
          <v-list-item v-show="ophab(98) || (externo && tipo=='MD')"
            link :to="{name:'migraciones'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-jira</v-icon>
              Migración de Datos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(83) && !externo" link :to="{name:'contactostipos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-contacts</v-icon>
              Contactos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(84) && !externo" link :to="{name:'mediosdepagos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-credit-card</v-icon>
              Medios de Pagos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(85) && !externo" link :to="{name:'paises'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-earth</v-icon>
              Paises
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(86) && !externo" link :to="{name:'provincias'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-church</v-icon>
              Provincias
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(87) && !externo" link :to="{name:'postales'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-city</v-icon>
              Códigos Postales
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(88) && !externo" link :to="{name:'bancos'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-bank</v-icon>
              Bancos
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(89) && !externo" link :to="{name:'tarjetas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-credit-card-plus</v-icon>
              Tarjetas
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(90) && !externo" link :to="{name:'rubros'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-jira</v-icon>
              Rubros
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-show="ophab(91) && !externo" link :to="{name:'zonas'}"
            :color="temas.barra_lateral_font">
            <v-list-item-title>
              <v-icon>mdi-jira</v-icon>
              Zonas
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp" app
      v-bind:style="{'background-color': temas.barra_principal_bg ?
      temas.barra_principal_bg : temas.barra_principal_bg}" dark>
      <v-app-bar-nav-icon
        v-show="isLoggedIn && activo && tipo!='UE'" @click.stop="drawer = !drawer"
        :color="temas.barra_principal_botonapp_bg"
        :dark="temas.barra_principal_botonapp_dark==true"
        v-bind:style="{'background-color': temas.barra_principal_bg
          ? temas.barra_principal_bg : temas.barra_principal_bg}">
      </v-app-bar-nav-icon>
      <v-toolbar-title style="width: 400px" class="ml-0 pl-4" v-show="isLoggedIn">
        <span class="body-2 hidden-sm-and-down">
          <v-list-item-avatar color="grey">
            <v-img height="40" width="40" :src="`/images/${avatar}`"></v-img>
          </v-list-item-avatar>
          {{empresa}}/{{operario}}/{{tipo}}/{{operarioId}}
          /{{$store.state.proveedores.length}}
          c:{{ contador }} cg:{{ contadorGohu }} cp:{{ contadorPub }} /
          {{$store.state.dolar}}
<!--
          {{empresa}}/{{operario}}/{{tipo}}/{{activo ? 'si' : 'no'}}/{{operarioId}}
          /{{externo}}/{{$store.state.proveedores.length}}
-->
        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- OFERTAS -->
      <v-tooltip bottom v-if="$store.state.tipo!='MD' && userId!=1">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="mr-2"
            v-show="isLoggedIn && activo && !hayCarrito" dense
            @click="ofertasOnOff()" v-on="on">
            <v-icon medium  :color="temas.barra_principal_bell_bg">
              {{!$store.state.ofertas ? 'mdi-cart-outline' : 'mdi-cart-off'}}
            </v-icon>
          </v-btn>
        </template>
        <span>Ofertas</span>
      </v-tooltip>
      <!-- FINAL OFERTAS -->

      <!-- CONSULTA DE PRECIOS -->
      <v-tooltip bottom v-if="userId!=1">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="mr-2"
            v-show="(ophab(49) || externo) && isLoggedIn && activo && !hayCarrito" dense
            link to="/preciosconsultas" v-on="on">
            <v-icon medium :color="temas.barra_principal_bell_bg">mdi-barcode</v-icon>
          </v-btn>
        </template>
        <span>Precios</span>
      </v-tooltip>
      <!-- FINAL CONSULTA DE PRECIOS -->

      <!-- VINCULOS -->
      <v-tooltip bottom v-if="userId!=1">
        <template v-slot:activator="{ on }">
          <v-btn
            fab small outlined class="text-capitalize mr-2"
            v-show="isLoggedIn && usuarios && activo && !hayCarrito && !operarioVendedor" dense
            @click="showUsuariosNuevos" v-on="on">
            <v-badge
              :content="usuarios.length"
              :value="usuarios.length"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium class="mr-1" :color="temas.barra_principal_bell_bg">
                mdi-share-variant
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>Vínculos</span>
      </v-tooltip>
      <!-- FINAL DE VINCULOS -->

      <!-- BOTON COTIZACIONES -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && activo && !hayCarrito"
            dense
            @click="verCotizaciones(true)" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-currency-usd
            </v-icon>
          </v-btn>
        </template>
        <span>Dolar ${{formatoImporte(dolar)}}</span>
      </v-tooltip>
      <!-- FINAL BOTON COTIZACIONES -->

      <!-- BOTON GRAFICOS -->
      <v-tooltip bottom v-if="!externo">
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && activo && !hayCarrito && !operarioVendedor"
            dense
            @click="setGraficos" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-chart-bar
            </v-icon>
          </v-btn>
        </template>
        <span>Estadísticas</span>
      </v-tooltip>
      <!-- FINAL BOTON GRAFICOS -->

      <!-- BOTON ESTADO FINANCIERO -->
      <v-tooltip bottom v-if="!externo">
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && activo && !hayCarrito && !operarioVendedor"
            dense
            @click="setEstadoFinanciero" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-newspaper
            </v-icon>
          </v-btn>
        </template>
        <span>Estado Financiero</span>
      </v-tooltip>
      <!-- FINAL BOTON ESTADO FINANCIERO -->

      <!-- BOTON REFRESH -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && activo && !hayCarrito && !operarioVendedor"
            dense
            @click="setContadores" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-refresh
            </v-icon>
          </v-btn>
        </template>
        <span>Refrescar</span>
      </v-tooltip>
      <!-- FINAL BOTON REFRESH -->

      <!-- BOTON DE GOHU -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && $store.state.novedadesGohu>0 && activo && !hayCarrito"  dense
            @click="showNotGohu" v-on="on">
            <v-badge
              :content="novedadesGohu"
              :value="novedadesGohu"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
                mdi-google-plus
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>gohu</span>
      </v-tooltip>
      <!-- FINAL BOTON DE GOHU -->

      <!-- BOTON DE NOTIFICACIONES CPRS -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && $store.state.novedadesCprs>0
            && activo && !hayCarrito && !operarioVendedor"
            dense @click="showNotCprs" v-on="on">
            <v-badge
              :content="novedadesCprs"
              :value="novedadesCprs"
              :color="temas.forms_btn_add_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
              <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
                mdi-bell-ring
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>Notificaciones de Comprobantes</span>
      </v-tooltip>
      <!-- FINAL BOTON DE NO TIFICACIONES -->

      <!-- SELECCION DE LA SUCURSAL -->
      <v-toolbar-items class="overflow-hidden">
        <v-select v-if="
          isLoggedIn &&
          !externo &&
          activo &&
          userId!==1 &&
          operarioVendedor==false"
          class="mt-3 caption"
          :color="temas.barra_principal_sucursal_bg"
          :dark="temas.barra_principal_sucursal_dark==true"
          :item-color="temas.barra_principal_sucursal_bg"
          :value="$store.state.sucursal"
          dense label="Sucursal" outlined
          @change="cambioSucursal"
          :items="sucursales" item-value="id" item-text="nombre" return-object>
        </v-select>

        <!-- SELECCION DEL PROVEEDOR -->
        <!--
        <v-select v-if="isLoggedIn
          && (tipo=='MI' || tipo=='MD') && activo && userId!==1
          && $store.state.proveedores.length>1"
          class="mt-3 ml-3 caption"
          :disabled="hayCarrito"
          :color="temas.barra_principal_sucursal_bg"
          :dark="temas.barra_principal_sucursal_dark==true"
          :item-color="temas.barra_principal_sucursal_bg"
          :value="$store.state.proveedor"
          dense label="Proveedor" outlined
          @change="cambioProveedor"
          :items="proveedores" item-value="id" item-text="nombre" return-object>
          <template slot="item" slot-scope="data">
            <v-avatar size="25px" class="mt-0">
              <img alt="Avatar" :src="`/images/${data.item.avatar}`">
            </v-avatar>
            <div class="contenedor-galeria-fuente-proveedor pl-2">
              {{ data.item.nombre }}
            </div>
          </template>
        </v-select>
        -->
      </v-toolbar-items>

      <!-- BOTON PASAR A SER GOHU -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn && externo && activo && !hayCarrito"
            dense @click="cambiarACuentaGohu" v-on="on">
            <v-icon medium class="mr-0" :color="temas.barra_principal_bell_bg">
              mdi-account-star
            </v-icon>
          </v-btn>
        </template>
        <span>Cambiar a licencia <b>gohu</b></span>
      </v-tooltip>
      <!-- FINAL BOTON PASAR A SER GOHU -->

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2 ml-2" fab small outlined
            link to="/profile" v-on="on"
            v-show="isLoggedIn">
            <v-icon  :color="temas.barra_principal_profile_bg">
              account_box
            </v-icon>
          </v-btn>
        </template>
        <span>Perfil</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="text-capitalize mr-2" fab small outlined
            v-show="isLoggedIn" @click="logout" v-on="on">
            <v-icon :color="temas.barra_principal_salir_bg">
              exit_to_app
            </v-icon>
          </v-btn>
        </template>
        <span>Salir</span>
      </v-tooltip>

      <v-btn class="text-capitalize mr-2" text
        to="/register"
        v-if="!isLoggedIn"
        @click="estoyEnLogin=true">
        <v-icon :color="temas.barra_principal_salir_bg">
          account_box
        </v-icon>
        Registrarse
      </v-btn>

      <v-btn
        class="text-capitalize mr-2" text
        to="/login"
        v-if="!isLoggedIn"
        @click="estoyEnLogin=true">
        <v-icon :color="temas.barra_principal_salir_bg">
          fingerprint
        </v-icon>
        Ingresar
      </v-btn>
    </v-app-bar>

    <!-- BOTONES PARA DIALOGOS DE NOTIFICACIONES  -->
    <!-- NOTIFICACIONES DE COMPROBANTES -->
    <v-dialog v-model="dialogNotCprs" max-width="1300px">
      <template v-slot:activator="{}"></template>
      <v-card tile>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeNotCprs"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Notificaciones</span>
        </v-toolbar>

        <v-container fluid>
          <v-row justify="start">
            <v-col v-for="(nota, idx) in notCprs" v-bind:key="idx">
              <v-card tile outlined class="mx-auto my-0 ml-2 pl-3 pt-3" max-width="1240"
                open-delay="200">
<!--
                <v-img height="90" width="90" v-if="nota.novedades[0].userdesde!=undefined"
                  :src="`/images/${nota.novedades[0].userdesde.logotipo}`">
                </v-img>
-->
                <v-card-title class="pt-1 pb-0 pl-0 titulo-proveedor">
                  {{ nota.usuario }} {{ nota.novedades.length ?
                    nota.novedades[0].userdesde.externo==1 ? '(externo)' : '' : '' }}

                  <v-tooltip bottom v-if="nota.cttPedidos>1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-show="!externo"
                        fab x-small outlined
                        class="mr-1 ml-4"
                        @click="impCprAll(nota)" v-on="on">
                        <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                        <v-badge
                          :content="nota.cttPedidos"
                          :value="nota.cttPedidos"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                        </v-badge>
                      </v-btn>
                    </template>
                    <span>Descargar todos los Pedidos</span>
                  </v-tooltip>

                  <v-tooltip bottom v-if="nota.cttPedFac>1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-show="!externo"
                        fab x-small outlined
                        class="mr-1 ml-4"
                        @click="impCprAll(nota)" v-on="on">
                        <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                        <v-badge
                          :content="nota.cttPedFac"
                          :value="nota.cttPedFac"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                        </v-badge>
                      </v-btn>
                    </template>
                    <span>Descargar todas las Facturas</span>
                  </v-tooltip>

                  <v-tooltip bottom v-if="nota.cttLeidos>1">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small outlined
                        class="mr-1 ml-4"
                        @click="leidosAll(nota, nov)" v-on="on">
                        <v-icon>mdi-thumb-up</v-icon>
                        <v-badge
                          :content="nota.cttLeidos"
                          :value="nota.cttLeidos"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                        </v-badge>
                      </v-btn>
                    </template>
                    <span>Marcar a todos como leidos</span>
                  </v-tooltip>

                </v-card-title>
                <v-card-text class="pl-0">
                  <v-container class="pl-0">
                    <v-row>
                      <div v-for="(nov, idx2) in nota.novedades" v-bind:key="idx2">
                        <v-col v-if="nov.comprobante!=null" cols="12" class="pl-3">
                          <v-card tile outlined :max-width="225" :min-width="225"
                            class="text--center">
                            <v-card-title>
                              <v-icon left>mdi-file</v-icon>
<!--
                              <span class="text-h6 font-weight-light">
                                {{ cprOrigen( nov )}}<br>
                              </span>
-->
                              <span class="cpr">
                                {{ cprOrigen( nov )}}<br>
                              </span>
                            </v-card-title>
                            <v-card-text class="pt-0 pb-0 pl-4 caption text--primary"
                              v-if="nov.comprobante!=null">
<!--
                              <div class="pt-2 pl-0"
                                v-if="nov.comprobante.vinculoHijo.length>0
                                && nov.comprobante.cpr.substr(0,3)=='FAC'">
                                Origen: {{nov.comprobante.vinculoHijo[0].padre.cpr}}
                              </div>
-->
                              <div class="pt-2 pl-0"
                                v-if="nov.comprobante.vinculoHijo.length>0">
                                Origen: {{nov.comprobante.vinculoHijo[0].padre.cpr}}
                              </div>
                              <div>
                                <v-chip class="mb-0"
                                  x-small>
                                    {{ nov.comprobante.observaciones=='PEDIDO DEL VENDEDOR' ?
                                      'vendedor' : 'cliente' }}
                                </v-chip>
                              </div>
                              <div class="pt-2 pl-0" v-if="nov.tipo=='R'" color="red">
                                <v-chip class="mb-0"
                                  x-small color="red" dark>
                                    Operación Rechazada
                                </v-chip>
                              </div>
                              <div class="pt-2 pl-0">
                                Total:$
                                {{formatoImporte(nov.comprobante.total)}}<br>
                              </div>
                              <div class="pt-0 pl-0" v-if="nov.tipo=='M'">
                                Pendiente:
                                ${{formatoImporte(nov.comprobante.pendientes[0].pendiente)}}
                                <br>
                                {{diasVencido(nov.comprobante.pendientes[0].vencimiento)}}
                                días Vencido (
                                {{formatoFecha(nov.comprobante.pendientes[0].vencimiento)}} )
                              </div>
                              <v-row v-for="(not, idx3) in nov.notas" v-bind:key="idx3"
                                v-show="not.borrada==false">
                                <div class="pt-0 pl-3 pb-1"
                                  v-if="not.nota=='Solicitud de Pago'">
                                  <v-chip class="mb-0" color='red' dark x-small>
                                      {{not.nota}}
                                  </v-chip>
                                </div>
                                <div class="pt-0 pl-3 pb-1"
                                  v-else-if="nov.tipo=='M'">
                                  <b>{{not.nota}}</b>
                                </div>
                                <div v-else class="pt-0 pl-3 pb-1">
                                  {{fechaTimeLine(not.fecha)}}<br>
                                  <b>{{not.nota}}</b>
                                  <br>
                                </div>
                              </v-row>
                            </v-card-text>

                            <v-card-actions class="text--center">

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')&&!externo"
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="impCpr(nota, nov)" v-on="on">
                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Descargar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')&&externo"
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="uneteAGohu()" v-on="on">
                                    <v-icon>mdi-information-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Unete a Gohu</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show=
                                    "nov.tipo=='B'||nov.tipo=='K'||nov.tipo=='D'||externo"
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="leido(nov,1)" v-on="on">
                                    <v-icon>mdi-thumb-up</v-icon>
                                  </v-btn>
                                </template>
                                <span>Leido</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="nov.tipo=='R'"
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="anular(nov,1)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Anular Operación</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')
                                    &&nov.comprobante.cpr.substr(0,3)=='PED'&&!externo"
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="anular(nov,1)" v-on="on">
                                    <v-icon>mdi-thumb-down-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Rechazar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='I'||nov.tipo=='F')
                                    && nov.comprobante.cpr.substr(0,3)=='PAG'"
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="rechazarCpr(nov)" v-on="on">
                                    <v-icon>mdi-thumb-down-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Rechazar Operación</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="nov.comprobante.items.length>0 "
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="verArt(nov)" v-on="on">
                                    <v-icon>mdi-barcode</v-icon>
                                  </v-btn>
                                </template>
                                <span>Artículos</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show=
                                    "(nov.comprobante.pendientes ||
                                    nov.comprobante.cancelaciones)
                                    && nov.comprobante.cpr.substr(0,3)!='PED'
                                    && !externo"
                                    fab x-small outlined
                                    class="mr-1 ml-2"
                                    @click="verPend(nov)" v-on="on">
                                    <v-icon>mdi-playlist-minus</v-icon>
                                    <!--<v-icon>mdi-message-text-outline</v-icon>-->
                                  </v-btn>
                                </template>
                                <span>
                                  {{nov.comprobante.cancelaciones ?
                                  'Cancelaciones y Valores' : 'Pendientes'}}
                                </span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="nov.tipo=='F'"
                                    fab x-small outlined
                                    class="mr-2 ml-2"
                                    @click="verCpr(nov)" v-on="on">
                                    <v-icon>mdi-printer</v-icon>
                                  </v-btn>
                                </template>
                                <span>Imprimir</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    v-show="(nov.tipo=='P'||nov.tipo=='F'||nov.tipo=='I')&&externo"
                                    fab x-small outlined
                                    class="ml-1"
                                    @click="enviarAExcel(nov)" v-on="on">
                                    <v-icon>mdi-file-excel</v-icon>
                                  </v-btn>
                                </template>
                                <span>Enviar a Excel</span>
                              </v-tooltip>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </div>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- CIERRE DE NOTIFICACIONES DE COMPROBANTES -->

    <!-- DIALOGO VER ARTICULOS -->
    <v-dialog v-model="dialogVerArticulos" max-width="1100px" persistent>
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="verArt()"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="text--right">Artículos del Comprobante</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersArt"
              :items="articulos"
              :class="temas.forms_titulo_bg" dense>
              <template v-slot:item.precio="{ item }">
                $ {{ formatoImporte(item.precio) }}
              </template>
              <template v-slot:item.cantidad="{ item }">
                {{ formatoImporte(item.cantidad) }}
              </template>
              <template v-slot:item.total="{ item }">
                $ {{ formatoImporte(item.total) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER ARTICULOS -->

    <!-- DIALOGO VER PENDIENTES -->
    <v-dialog v-model="dialogVerPendientes" max-width="500px" persistent>
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="verPend()"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="text--right">Pendientes</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersPend"
              :items="pendientes"
              dense
              :hide-default-footer="true">
              <template v-slot:item.vencimiento="{ item }">
                {{ formatoFecha(item.vencimiento) }}
              </template>
              <template v-slot:item.importe="{ item }">
                $ {{ formatoImporte(item.importe) }}
              </template>
              <template v-slot:item.pendiente="{ item }">
                $ {{ formatoImporte(item.pendiente) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER PENDIENTES -->

    <!-- DIALOGO VER CANCELACIONES -->
    <v-dialog v-model="dialogVerCancelaciones" max-width="1000px" persistent>
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="verPend()"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="text--right">Cancelaciones y Valores</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          <v-container>
            <span class="ml-4"><b>Cancelaciones</b></span>
            <v-data-table
              :headers="headersCan"
              :items="cancelaciones"
              dense
              :hide-default-footer="true">
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                {{ formatoFecha(item.cancelado.comprobante.fecha) }}
              </template>
              <template v-slot:item.importe="{ item }">
                $ {{ formatoImporte(item.importe) }}
              </template>
              <template v-slot:item.cancelado.importe="{ item }">
                $ {{ formatoImporte(item.cancelado.importe) }}
              </template>
              <template v-slot:item.cancelado.pendiente="{ item }">
                $ {{ formatoImporte(item.cancelado.pendiente) }}
              </template>
            </v-data-table>

            <br>
            <span class="ml-4"><b>Valores</b></span>
            <v-data-table
              :headers="headersMed"
              :items="valoresEgresos"
              dense>
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                {{ formatoFecha(item.cancelado.comprobante.fecha) }}
              </template>
              <template v-slot:item.fecha="{ item }">
                {{ formatoFecha(item.fecha) }}
              </template>
              <template v-slot:item.importe="{ item }">
                $ {{ formatoImporte(item.importe) }}
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO VER CANCELACIONES -->

    <!-- DIALOGO RECHAZAR CPR -->
    <v-dialog v-model="dialogRechazarCpr" max-width="400px" persistent>
      <template v-slot:activator="{}"></template>

      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="cancelarRechazoCpr">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="headdline">Motivo del Rechazo</span>
        <v-spacer></v-spacer>
        <v-btn v-show="detRechazo!=''"
          :color="temas.cen_btns_bg"
          :dark="temas.cen_btns_dark==true"
          class="ma-2 white--text" @click="confirmarRechazoCpr">
          Confrmar
        </v-btn>
      </v-toolbar>

      <v-card>
        <v-card-text>
          <v-container>
            <v-textarea
              class="pt-6"
              v-model="detRechazo"
              autofocus
              outlined
              :color="$store.state.temas.forms_titulo_bg"
              rows="5">
            </v-textarea>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO RECHAZAR CPR -->

    <!-- UNETE A GOHU -->
    <v-dialog v-model="dialogUneteAGohu" max-width="600px" persistent>
      <template v-slot:activator="{}"></template>

      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="closeUneteAGohu">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="headdline">
          ¿Que esperas para unirte a gohu?
        </span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          <v-container>
            <p>
              <br>
              <b>Unete a Gohu y podrás, entre muchas otras cosas, importar este comprobante en
              tus compras y realizar toda la administración del mismo.</b><br><br>
              Evitarás errores y ahorrarás tiempo. Además se actualizarán tus stocks,
              tu Cuenta Corriente, y tu Crédito Fiscal. Todo con un solo click<br><br>
              Luego podrás realizar el pago por sistema y tu proveedor lo recibirá al instante,
              actualizando todos los valores que le hayas enviado y cancelando tu Cuenta Corriente,
              éstas siempre estarán sincronizadas.<br><br>
              En <b>gohu</b> compartimos datos y operaciones, para que todo sea mas fácil.
            </p>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN DIALOGO UNETE A GOHU -->

    <!-- CAMBIAR A GOHU -->
    <v-dialog v-model="dialogCambiarAGohu" max-width="600px" persistent>
      <template v-slot:activator="{}"></template>

      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="dialogCambiarAGohu=false">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="headdline">
          Cambiar a licencia <b>gohu</b>
        </span>
        <v-spacer></v-spacer>
        <v-btn
          :color="temas.cen_btns_bg"
          :dark="temas.cen_btns_dark==true"
          class="ma-2 white--text"
          @click="confirmarCuentaAGohu">
          Iniciar Proceso
        </v-btn>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          <v-container>
            <p class="contenedor-galeria-fuente-final">
              <br>
              Cambia a <b>gohu</b> y utiliza el sistema en su totalidad.
              <br><br>
              Se habilitarán los módulos Ventas, Compras, Stoks, Tesorería, Bancos, etc.<br>
              Además podras compartir operaciones con otros usuarios <b>gohu</b><br>
              ahorrando mucho tiempo y evitando errores de carga.<br><br>
              Tendrás que realizar algunas configuraciones adicionales, como por ejemplo, subir
              tus certificados digitales para que puedas emitir comprobantes electrónicos.<br><br>
              ¡Con mucho gusto te ayudaremos a realizar la puesta en marcha.!
            </p>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN CAMBIAR A GOHU -->

    <!-- COTIZACIONES DEL DOLAR -->
    <v-dialog v-model="dialogCotizaciones" max-width="450px" persistent>
      <template v-slot:activator="{}"></template>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true"
          icon @click="closeVerCotizaciones">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="headdline">
          Cortización del Dolar
        </span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersCot"
              :items="cotDolar"
              dense
              :hide-default-footer="true">
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN COTIZACIONES DEL DOLAR -->

    <!-- NOTIFICACIONES DE GOHU -->
    <v-dialog v-model="dialogNotGohu" max-width="1300px">
      <template v-slot:activator="{}"></template>

      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeNotGohu"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Notificaciones</span>
        </v-toolbar>

        <v-container fluid>
          <v-row justify="start">
            <v-col v-for="(nota, idx) in notUsrs" v-bind:key="idx" cols="4">
              <v-card tile outlined max-width="300" min-width="300" class="pt-0 pb-0">
                <v-card-title class="pt-1 pb-0 subtitle-2">
                  {{nota.usuario.userdesde.username}}
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-card tile outlined>
                      <v-card-title>
                        <span class="text-h6 font-weight-light">
                          ¡Solicitud de Plan!
                        </span>
                      </v-card-title>
                      <v-card-text class="pt-0 pb-0 caption white text--primary">
                        <span>
                          {{ nota.usuario.detalles }}
                          {{ nota.usuario.userdesde.email }}
                        </span>
                      </v-card-text>
                      <v-card-actions>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              fab x-small outlined
                              class="mt-6 mr-2 ml-2"
                              @click="aceptarRechazarPlan(nota, true)" v-on="on">
                              <v-icon>mdi-thumb-up</v-icon>
                            </v-btn>
                          </template>
                          <span>Aceptar Solicitud</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              fab x-small outlined
                              class="mt-6 mr-2"
                              @click="aceptarRechazarPlan(nota, false)" v-on="on">
                              <v-icon>mdi-thumb-down</v-icon>
                            </v-btn>
                          </template>
                          <span>Rechazar Solicitud</span>
                        </v-tooltip>
                      </v-card-actions>
                    </v-card>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- CIERRE DEL DIALOG NOTIFICACIONES GOHU -->

    <!-- ADMINISTRACION DE VINCULOS CON USUARIOS -->
    <v-dialog v-model="dialogUsuarios" :fullscreen="true" persistent>
      <template v-slot:activator="{}"></template>

      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeUsuarios"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Vínculos {{empresa}}</span>
        </v-toolbar>

        <v-row>
          <v-col cols="2" sm="2" md="2">
            <v-card flat class="ml-0 mt-0">
              <v-card-subtitle>
                <span class="text-h6 font-weight-light pb-0 ml-2 mt-0">Cuales ver</span>
              </v-card-subtitle>
              <v-card-text class="pt-2 pb-4 pl-0 caption text--primary">
                <div class="text-left">

                  <v-tooltip v-for="(vp, i) in vinculosPanel" v-bind:key="i" bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab small class="ml-10 mt-2"
                        :color="vinculosAVerCual==i+1 ? 'red' : temas.forms_titulo_bg"
                        :dark="temas.forms_titulo_dark==true"
                        @click="vinculosVer(i+1)" v-on="on">
                        <v-badge
                          :content="vinculosPanel[i].ctt"
                          :value="vinculosPanel[i].ctt"
                          :color="temas.forms_btn_add_bg"
                          :dark="temas.forms_btn_add_bg==true">
                          <v-icon medium class="mr-0">
                            {{vinculosPanel[i].icono}}
                          </v-icon>
                        </v-badge>
                      </v-btn>
                    </template>
                    <span>{{vinculosPanel[i].toolTip}}</span>
                  </v-tooltip>
                </div>
              </v-card-text>
              <v-divider class="mx-1"></v-divider>
              <v-card-subtitle>
                <span class="text-h6 font-weight-light ml-2">Filtrar Rubros</span>
              </v-card-subtitle>
              <v-card-text class="pt-2 pb-0 pl-0 caption text--primary">
                <div class="text-left" v-if="rubros.length>0">
                  <v-chip-group column multiple>
                    <v-chip v-for="(rub, i) in rubros" :key="i"
                      class="ml-3 ma-2" outlined multiple
                      @click="filtrarPorRubro(rub)">
                      {{ rub.nombre }}
                      <v-avatar v-if="rub.sel">
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                      </v-avatar>
                    </v-chip>
                  </v-chip-group>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="10" sm="10" md="10">
            <v-card flat>
              <v-row>
                <v-col cols="3" class="pl-9 text-h5 font-weight-light">
                  <span>{{vinculosPanel[vinculosAVerCual-1].toolTip}}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col v-for="(us, i) in usuarios" v-bind:key="i" class="ml-4 mr-4">
                  <div class="contenedor-galeria">
                    <v-hover v-slot="{ hover}">
                      <v-card tile class="mx-auto my-0 ml-2" max-width="200"
                        :elevation="hover ? 12 : 1"
                        open-delay="200"
                        :class="{ 'on-hover': hover }">
                        <v-img height="90" width="200"
                          :src="`/images/${us.logotipo}`">
                        </v-img>
                        <template slot="progress"></template>
                        <v-card-title>
                          <span class="text-h6 font-weight-light">
                            {{us.id}}{{us.username}}
                          </span>
                        </v-card-title>
                        <v-divider class="mx-1"></v-divider>
                        <v-card-text class="pt-2 pb-0 pl-4 caption text--primary">
                          <div>
                            <span v-for="(rub, r) in us.usersrubros" v-bind:key="r">
                              <v-chip small>{{ rub.nombre }}</v-chip>
                            </span>
                          </div>
                          <div v-if="us.tipo=='MD'" class="pt-2">
                            <span class="pl-0">
                              <b>
                                {{ us.accesolibre ? 'Acceso Libre' : 'Requiere Autorización' }}
                              </b>
                              <br>
                            </span>
                          </div>
                          <div class="pt-2">
                            <span class="pl-0">
                              <b>{{ getEstadoDelVinculo(us) }} </b><br>
                            </span>
                          </div>
                          <div>
                            <span class="pl-0">
                              <b>{{ us.externo ? 'Usuario externo' : 'Usuario gohu' }}</b>
                              <b>{{ us.administragohu ? '(g)' : '' }}</b>
                            </span>
                          </div>
                          <div>
                            <span v-if="us.solicitud==1"
                              color='red'>
                              {{ us.mensaje }}{{us.esElQue}}
                            </span>
                          </div>
                        </v-card-text>
                        <v-card-actions>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioMasInformacion(us)" v-on="on">
                                <v-icon>mdi-information-outline</v-icon>
                              </v-btn>
                            </template>
                            <span>Mas información
                              {{us.esElQue}}
                              {{us.solicitud}}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn  v-show="us.ver==1 && us.solicitud==0 && us.vinculado==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioSolicitarVinculo(us)" v-on="on">
                                <v-icon>
                                  {{us.accesolibre ? 'mdi-barcode' : 'mdi-share-variant' }}
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>
                              {{us.accesolibre ? 'Activar vínculo' : 'Solicitar vínculo' }}
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom v-if=
                            "us.esElQue=='Recibe' && us.vinculado==0 && us.solicitud==1">
                            <template v-slot:activator="{ on }">
                              <v-btn
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioAceptarVinculo(us)" v-on="on">
                                <v-icon>mdi-share-variant</v-icon>
                              </v-btn>
                            </template>
                            <span>Aceptar vínculo</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show="us.vinculado==1 && us.ver==1"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioCancelarVinculo(us)" v-on="on">
                                <v-icon>mdi-cancel</v-icon>
                              </v-btn>
                            </template>
                            <span>Cancelar vínculo</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show="us.ver==1 && us.vinculado==0 && us.solicitud==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioDejarDeVer(us)" v-on="on">
                                <v-icon>mdi-pin-off</v-icon>
                              </v-btn>
                            </template>
                            <span>Descartar</span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show="us.ver==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioVerDeNuevo(us)" v-on="on">
                                <v-icon>mdi-account-plus</v-icon>
                              </v-btn>
                            </template>
                            <span>Ver de nuevo</span>
                          </v-tooltip>
                          <!--
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show=
                                "us.vinculado==1 && us.tipo=='MI' && us.articulos==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioTransferirArticulos(us)" v-on="on">
                                <v-icon>mdi-barcode</v-icon>
                              </v-btn>
                            </template>
                            <span>Transferir mis Artículos a {{us.username}}
                              {{us.esElQue}}
                            </span>
                          </v-tooltip>
                          -->
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show=
                                "us.vinculado==1&&us.tipo=='MD'&&us.activo==1&&us.pausado==0"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioPausarVinculo(us)" v-on="on">
                                <v-icon>mdi-pause</v-icon>
                              </v-btn>
                            </template>
                            <span>Pausar Vínculo
                            </span>
                          </v-tooltip>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn
                                v-show=
                                "us.vinculado==1&&us.tipo=='MD'&&us.activo==1&&us.pausado==1"
                                fab x-small outlined
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true"
                                class="mr-1 ml-1 mt-0"
                                @click="usuarioReanudarVinculo(us)" v-on="on">
                                <v-icon>mdi-play</v-icon>
                              </v-btn>
                            </template>
                            <span>Reanudar Vínculo
                            </span>
                          </v-tooltip>
                        </v-card-actions>
                      </v-card>
                    </v-hover>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <!-- FIN DE ADMINISTRACION DE VINCULOS CON USUARIOS -->

    <!-- SOLICITAR NUEVO VINCULO -->
    <v-dialog v-model="dialogSolicitarVinculo" max-width="500px" persistent>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeSolicitarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">
            {{!nuevoVinculo.accesolibre ? 'Solicitar' : 'Activar'}}
            Vínculo con {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text"
            @click="enviarSolicitudVinculo">
            {{!nuevoVinculo.accesolibre ? 'Enviar Solicitud' : 'Activar'}}
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p v-if="!nuevoVinculo.accesolibre" class="pt-3">
                    Vas a enviar una solicitud de vínculo comercial a
                    <b>{{nuevoVinculo.username}}</b><br><br>
                    Luego de que <b>{{nuevoVinculo.username}}</b> acepte,
                    <span v-if="nuevoVinculo.tipo=='MI'">
                      todos tus artículos, promociones y pecios serán transferidos
                      para que él pueda utilizarlos,<br>
                      y estar al tanto en todo momento de tus modificaciones.
                    </span>
                    <span v-else>
                      podrás ver sus artículos, precios y promociones.<br>
                      Cada acción que realice <b>{{nuevoVinculo.username}}</b> sobre ellos,
                      se reflejarán instantaneamente en tu sistema.<br><br>
                      ¡Estarás actualizado en todo momento!<br><br>
                    </span>
                  </p>
                  <p v-else-if="nuevoVinculo.accesolibre && nuevoVinculo.tipo=='MD'" class="pt-3">
                    Vas a activar el vínculo comercial con
                    <b>{{nuevoVinculo.username}}</b><br><br>
                    Podrás ver sus artículos, promociones y precios.<br>
                    Cada acción que realice <b>{{nuevoVinculo.username}}</b> sobre ellos,
                    se reflejarán instantaneamente en tu sistema.<br><br>
                    ¡Estarás actualizado en todo momento!<br><br>
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN SOLICITAR NUEVO VINCULO -->

    <!-- ACEPTAR NUEVO VINCULO -->
    <v-dialog v-model="dialogAceptarVinculo" max-width="500px" persistent>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeAceptarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">
            Aceptar Vínculo con {{nuevoVinculo.username}}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text"
            @click="aceptarSolicitudDeVinculo">
            Aceptar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="pt-3">
                    Confirma si quieres a <b>{{nuevoVinculo.username}}</b>
                    como un nuevo
                    <b>{{nuevoVinculo.tipo=='MD' ? 'Proveedor': 'Cliente'}}</b>
                  </p>
                  <div v-if="nuevoVinculo.tipo=='MD'">
                    <p v-if="externo && nuevoVinculo.externo">
                      Ambos son usuarios externos.<br>
                      Podrás consultar sus artículos y realizarle pedidos.
                    </p>
                    <p v-else-if="!externo && nuevoVinculo.externo">
                      <b>{{nuevoVinculo.username}}</b> ha seleccionado la licencia
                      <i>Externa</i>, no obstante podrás consultar sus artículos y realizarle
                      pedidos.
                    </p>
                    <p v-else-if="externo && !nuevoVinculo.externo">
                      Tu eres usuario <b>externo</b> y {{nuevoVinculo.username}}
                      <b>gohu</b><br>
                      Podrás consultar sus artículos y realizarle pedidos.
                    </p>
                    <p v-else-if="!externo && !nuevoVinculo.externo">
                      Ambos son usuarios <b>gohu</b><br>
                      Además de compartir artículos vas a activar
                      la versión <b>Intrapyme</b>,
                      donde todas las operaciones entre ambos usuarios van por sistema.
                      Estas se sincronizan permitiendo ahorrar tiempo y evitar errores.
                    </p>
                  </div>
                  <div v-else>
                    <p v-if="externo && nuevoVinculo.externo">
                      <b>{{nuevoVinculo.username}}</b> es usuario <b>externo</b><br>
                      podrá ver tu carrito, tus precios, tus promociones, realizarte
                      pedidos y recibir la reglas de precios que quieras aplicarle.
                    </p>
                    <p v-else-if="!externo && nuevoVinculo.externo">
                      <b>{{nuevoVinculo.username}}</b> ha seleccionado la licencia
                      <i>Externa</i>, no obstante podrá ver tu carrito, tus precios,
                      tus promociones, realizarte pedidos y recibir la reglas de
                      precios que quieras aplicarle.
                    </p>
                    <p v-else-if="externo && !nuevoVinculo.externo">
                      <b>{{nuevoVinculo.username}}</b> es usuario <b>gohu</b><br>
                      podrá ver tu carrito, tus precios, tus promociones, realizarte
                      pedidos y recibir la reglas de precios que quieras aplicarle.
                    </p>
                    <p v-else-if="!externo && !nuevoVinculo.externo">
                      Ambos son usuarios <b>gohu</b><br>
                      Además de compartir tus artículos, vas a activar
                      la versión <b>Intrapyme</b>,
                      donde todas las operaciones entre ambos usuarios van por sistema.
                      Estas se sincronizan y te van a permitir ahorrar tiempo y evitar
                      errores.
                    </p>
                  </div>
                  <p v-if="nuevoVinculo.tipo=='MI'">
                    Si confirmas espejarás los precios de tus {{transferirArticulosCtt}}
                    artículos con <b>{{nuevoVinculo.username}}</b>.
                  </p>
                  <p v-else>
                    Si confirmas espejarás los precios de tus {{transferirArticulosCtt}}
                    artículos con <b>{{nuevoVinculo.username}}</b>.
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN ACEPTAR NUEVO VINCULO -->

    <!-- CANCELAR VINCULO -->
    <v-dialog v-model="dialogCancelarVinculo" max-width="500px" persistent>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeCancelarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Cancelar Vínculo con {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text" @click="cancelarVinculo">
            Cancelar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="pt-3">
                    Vas a cancelar el vínculo comercial con
                    <b>{{nuevoVinculo.username}}</b>.<br>
                  </p>
                  <p>
                    Los Artículos, precios y promociones dejarán de ser visibles,<br>
                    y las operaciones <b>Intrapyme</b> que existan permanecerán
                    activas.<br><br>
                    Podrás retomar este vínculo en cualquier momento cuando lo creas necesario.
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN CANCELAR VINCULO -->

    <!-- ACEPTAR PAUSAR VINCULO -->
    <v-dialog v-model="dialogPausarVinculo" max-width="650px" persistent>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closePausarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Pausar articulos de {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text" @click="aceptarPausarVinculo">
            Aceptar Pausar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="pt-3">
                    Vas a pausar el vinculo con
                    <b>{{nuevoVinculo.username}}</b>.<br>
                  </p>
                  <div v-if="nuevoVinculo.tipo=='MD'">
                    <p>
                      Dejarás de ver sus artículos y promociones.<br>
                      Y tampoco podras realizarle mas pedidos.<br>
                    </p>
                  </div>
                  <div v-else>
                    <p>
                      No podrá ver mas tus articulos ni realizarte pedidos.<br>
                    </p>
                  </div>
                  <p>No obstante, podrás retomar este vínculo cuando lo creas necesario.</p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN PAUSAR VINCULO -->

    <!-- ACEPTAR REANUDAR VINCULO -->
    <v-dialog v-model="dialogReanudarVinculo" max-width="650px" persistent>
      <v-card>
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeReanudarVinculo"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Reanudar vínculo con {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text" @click="aceptarReanudarVinculo">
            Aceptar Reanudar Vínculo
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="pt-3">
                    Vas a reanudar el vínculo con
                    <b>{{nuevoVinculo.username}}</b>.<br>
                  </p>
                  <div v-if="nuevoVinculo.tipo=='MD'">
                    <p>
                      Podrás volver a ver y utilizar sus artículos y promociones.<br>
                      Y también volver a hacerle pedidos.<br>
                    </p>
                  </div>
                  <div v-else>
                    <p>
                      No podrá ver mas tus articulos ni realizarte pedidos.<br>
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN REANUDAR VINCULO -->

    <!-- MAS INFORMACION -->
    <v-dialog v-model="dialogMasInformacion" max-width="500px" persistent>
      <v-card class="contenedor-galeria-fuente-final">
        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeMasInformacion"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--right">Información sobre {{nuevoVinculo.username}}</span>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container fluid>
          <template v-slot:activator="{}"></template>
          <v-card outlined>
            <v-container fluid class="pt-0">
              <v-row>
                <v-col cols="12" sx="2" mx="2" class="pt-0">
                  <p class="mt-2">
                    Razón Social: <b>{{masInfo.razonSocial}}</b><br>
                    Dirección: <b>{{masInfo.direccion}}</b><br>
                    Localidad: <b>{{masInfo.localidad}}</b><br>
                    Provincia: <b>{{masInfo.provincia}}</b><br>
                    Tipo de Responsable: <b>{{masInfo.tipoDeResponsable}}</b><br>
                    CUIT: <b>{{masInfo.cuit}}</b><br><br>
                    <b>Contactos</b>
                    <table>
                      <tr v-for="(contacto, idd) in masInfo.contactos" v-bind:key="idd">
                        <td><v-icon>{{contacto.contactoTipo.icono}}</v-icon></td>
                        <td>{{contacto.observaciones}}</td>
                      </tr>
                    </table>
                    <br>
                    En gohu desde el:
                    <b>{{desdeEnGohu()}}</b> ({{diasEnGohu()}} días)<br>
                    Usuarios Vinculados: <b>{{masInfo.cttUsrsVinculados}}</b><br>
                    Artículos: <b>{{masInfo.cttArticulos}}</b><br>
                    Publicaciones: <b>{{masInfo.cttPublicaciones}}</b><br>
                    <br>
                    Pedidos Procesados: <b>{{masInfo.cttPedidos}}</b><br>
                    Calificación: <b>{{roundTo(masInfo.calificacion,1)}}</b><br>
                    Observaciones: <b>{{masInfo.observ}}</b><br>
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- FIN MAS INFORMACION -->

    <!-- ESTADO FINANCIERO -->
    <v-dialog v-model="dialogEstadoFinanciero" max-width="900px" persistent>
      <template v-slot:activator="{}"></template>
      <v-toolbar flat dark :color="$store.state.temas.forms_titulo_bg">
        <v-btn icon
          @click="dialogEstadoFinanciero=false"
          :color="$store.state.temas.forms_close_bg"
          :dark="$store.state.temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="text--right">Estado Financiero</span>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card tile>
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="headersEstadoFinanciero"
              :items="estFinDia"
              dense
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              show-expand
              item-key="vencimiento"
              :hide-default-footer="false"
              :footer-props="footerProps13">
              <template v-slot:item.debe="{ item }">
                $ {{ formatoImporte(item.debe) }}
              </template>
              <template v-slot:item.haber="{ item }">
                $ {{ formatoImporte(item.haber) }}
              </template>
              <template v-slot:item.saldo="{ item }">
                $ {{ formatoImporte(item.saldo) }}
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-data-table
                    :headers="headersEstadoFinancieroDet"
                    :items="item.items"
                    dense
                    hide-default-footer>
                    <template v-slot:item.importe="{ item }">
                      $ {{ formatoImporte(item.importe) }}
                    </template>
                    <template v-slot:item.acumulado="{ item }">
                      $ {{ formatoImporte(item.acumulado) }}
                    </template>
                    <template v-slot:item.vencimiento="{ item }">
                      {{ formatoFechaCorta(item.vencimiento) }}
                    </template>
                    <template v-slot:item.tercero="{ item }">
                      {{ item.tercero.substring(0,25) }}
                    </template>
                    <template v-slot:item.descripcion="{ item }">
                      <v-badge class="pb-1"
                        dot
                        :color="item.importe>0?'green':'red'"
                        :dark="item.importe<0?
                        temas.cen_card_activo_dark:
                        temas.barra_principal_dark"
                        rigth>
                      </v-badge>
                      <span class="pl-3">{{item.descripcion}}</span>
                    </template>
                  </v-data-table>
                </td>
              </template>

            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- FIN ESTADO FINANCIERO -->

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
<!--
      <v-snackbar
        :value="snack.showing">
        {{ snack.text}}
        <v-btn text @click="snack.showing=false">
          Cerrar
        </v-btn>
      </v-snackbar>
-->
    </v-main>

    <!-- USUARIOS GOHU -->
    <v-card v-if="!isLoggedIn && !estoyEnLogin" flat>
      <v-container fluid class="pt-0">
        <v-row class="pt-0">
          <v-col cols="4"></v-col>
          <v-col cols="4">
            <v-img class="pt-0 mx-auto"
              height="125"
              width="200"
              src="/images/logoGoHu.jpg">
            </v-img>
          </v-col>
          <v-col cols="4"></v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p class="bigfont text-md-center">
              <v-icon>mdi-share-variant</v-icon>
              Comparte, unifica y ahorra tiempo con <b>gohu</b>.<br>
              Un ERP que te va a permitir agilizar tus procesos de negocios.<br>
<!--          <a href="https://www.youtube.com">Revisa nuestros videos aquí,</a>
              quizás <b>gohu</b> pueda ser de tu utilidad.    -->
            </p>
          </v-col>
          <v-col cols="3"></v-col>
        </v-row>
        <!--
        <v-row justify="start">
          <v-col>
            <p class="bigfont">Confiaron en nosotros...</p>
          </v-col>
        </v-row>
        <v-row justify="start">
          <v-col v-for="(g, idx) in gohu" v-bind:key="idx">
            <v-card tile outlined :max-width="272" :min-width="272"
              class="text--center">
              <v-img height="70" width="190" :src="`/images/${g.logotipo}`"></v-img>
              <v-card-title>
                <span class="text-h6 font-weight-light">
                  {{g.name}}
                </span>
              </v-card-title>
              <v-card-text class="pt-0 pb-0 pl-4 caption text--primary">
                <div class="pt-2 pl-0">
                  <v-row class="pl-3">
                    Comercializa como
                    {{ g.tipo=='IP' ? 'Importador' : g.tipo=='MD' ? 'Mayorista' : 'Minorista' }}
                    {{ g.rubros.length==1 ? 'en el rubro' : 'en los rubros' }}
                    <div v-for="(r, idr) in g.rubros" v-bind:key="idr">
                      <div class="spacer text-center">
                        <v-chip small color="gray">{{r}}</v-chip>
                      </div>
                    </div>
                  </v-row>
                </div>
                <div class="pt-0 pl-0">
                  Mail {{g.mail}}
                </div>
                <div class="pt-0 pl-0">
                  Desde {{ formatoFecha(g.desde) }}
                </div>
                <div class="pt-0 pl-0">
                  Artículos compartidos {{ g.arts }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        -->
      </v-container>
    </v-card>

    <impresiones ref="impresion"></impresiones>
    <SBar></SBar>
    <confirmacion v-model='msg.msgAccion'
      :title=this.msg.msgTitle
      :body=this.msg.msgBody
      :visible=this.msg.msgVisible
      :buttons=this.msg.msgButtons
      @click="msgRespuesta">
    </confirmacion>


  </v-app>
</template>

<script>
  /* eslint-disable */
  import HTTP from './http';
  import axios from 'axios';
  import SBar from './views/Forms/snackbar.vue';
  import confirmacion from "./views/Forms/confirmacion.vue";
  import impresiones from "./views/Forms/impresiones.vue";
  import moment from 'moment';
  import XLSX from 'xlsx';
  import jsPDF from 'jspdf';
  import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
  import router from './router';

  export default {
    components: {
      SBar,
      confirmacion,
      impresiones,
    },
    props: {
      source: String,
      },
    data: () => ({
      msg: {
        msgAccion: null,
        msgVisible: false,
        msgTitle: '',
        msgBody: '',
        msgButtons: ['']
      },
      estoyEnLogin: false,
      menuNotUsrsNot: [ 
        {icon: 'mdi-qrcode', say: 'artículos', nov: 0 },
        {icon: 'mdi-share-variant', say: 'vínculos', nov: 0 },
        {icon: 'mdi-message-text-outline', say: 'mensajes', nov: 0 },
      ],
      notUsrsAct: 0,
      notUsrsSel: [],
      usuarios: [],
      usuariosBkp: [],
      rubros: [],
      selectedItem: 0,
      footerProps: {'items-per-page-options': [10]},
      footerProps13: {'items-per-page-options': [13]},
      vinculosPanel: [
        {ctt: 0, toolTip: 'A vincular',  icono: 'mdi-account-plus' },
        {ctt: 0, toolTip: 'Vinculados',  icono: 'mdi-share-variant' },
        {ctt: 0, toolTip: 'Descartados', icono: 'mdi-pin-off' },
        {ctt: 0, toolTip: 'Solicitudes', icono: 'mdi-human-greeting' },
      ],
      vinculosPadresLoc: [],
      vinculosHijosLoc: [],
      vinculosAVerCual: 1,

      itemActual: null,
      cotDolar: [],
      yaLeyoElDolar: false,
      notUsrs: [],
      notCprs: [],
      articulos: [],
      pendientes: [],
      cancelaciones: [],
      valoresEgresos: [],
      gohu: [],
      estFin: [],
      estFinDia: [],
      expanded: [],
      singleExpand: false,
      detRechazo: '',
      compartiendo: 0,
      drawer: false,
      dialogNotCprs: false,
      dialogNotUsrs: false,
      dialogNotGohu: false,
      dialogUsuarios: false,
      dialogVerArticulos: false,
      dialogVerPendientes: false,
      dialogVerCancelaciones: false,
      dialogRechazarCpr: false,
      dialogUneteAGohu: false,
      dialogCotizaciones: false,
      dialogCambiarAGohu: false,

      dialogSolicitarVinculo: false,
      dialogAceptarVinculo: false,
      dialogCancelarVinculo: false,
      dialogPausarVinculo: false,
      dialogReanudarVinculo: false,
      dialogMasInformacion: false,
      dialogEstadoFinanciero: false,
      transferirArticulosCtt: 0,

      barra_principal_bg: '',
      barra_principal_color: '',
      barra_principal_dark: '',
      barra_lateral_bg: '',
      barra_lateral_color: '',
      barra_lateral_dark: '',
      sucursalId: '',
      sucursalNombre: '',
      sucItems: [],
      contador: 0,
      contadorPub: 0,
      contadorGohu: 0,
      resMeses: [],

      nuevoVinculo: {
        vinculo_id: null,
        user_id: null,
        username: null,
        logotipo: null,
        ver: null,
        articulos: null,
        preferido: null,
        vinculado: null,
        solicitud: null,
        externo: null,
        activo: null,
        tipo: null,
        esElQue: null,
        notificacion_id: null,
        usersrubros: null,
        administragohu: null,
        accesolibre: null,
      },
      masInfo: {
        razonSocial: '',
        direccion: '',
        localidad: '',
        provincia: '',
        tipoDeResponsable: '',
        cuit: '',
        calificacion: '',
        observ: '',
        enGohuDesdeEl: '',
        cttUsrsVinculados: '',
        cttArticulos: '',
        cttPedidos: '',
        cttPublicaciones: '',
        contactos: [],
      },
      headersCot: [
        { text: 'Moneda', value: 'nombre', align: 'left', width: 100 },
        { text: 'Compra', value: 'compra', align: 'end', width: 80},
        { text: 'Venta', value: 'venta', align: 'end', width: 80},
      ],
      headersArt: [
        { text: 'CODIGO', value: 'articulo.codigo', align: 'left', width: 120 },
        { text: 'DESCRIPCION', value: 'articulo.nombre', align: 'left', width: 420},
        { text: 'PRECIO', value: 'precio', align: 'end', width: 120},
        { text: 'CANTIDAD', value: 'cantidad', align: 'end', width: 120},
        { text: 'TOTAL', value:'total', align: 'end', width: 120},
      ],
      headersPend: [
        { text: 'FECHA', value: 'vencimiento', align: 'left', width: 120 },
        { text: 'IMPORTE', value: 'importe', align: 'end', width: 120},
        { text: 'PENDIENTE', value:'pendiente', align: 'end', width: 120},
      ],
      headersCan: [
        { text: 'FECHA', value: 'cancelado.comprobante.fecha', align: 'left', width: 120 },
        { text: 'COMPROBANTE', value: 'cancelado.comprobante.cpr', align: 'left', width: 420},
        { text: 'TOTAL', value: 'cancelado.importe', align: 'end', width: 120},
        { text: 'CANCELADO', value: 'importe', align: 'end', width: 120},
        { text: 'PENDIENTE', value: 'cancelado.pendiente', align: 'end', width: 120},
      ],
      headersEstadoFinanciero: [
        { text: 'FECHA', value: 'vencimiento', align: 'left', width: 89 },
        { text: 'DEBE', value: 'debe', align: 'end', width: 170},
        { text: 'HABER', value: 'haber', align: 'end', width: 170},
        { text: 'SALDO', value: 'saldo', align: 'end', width: 170},
      ],
      headersEstadoFinancieroDet: [
        //{ text: 'VENCIM.', value: 'vencimiento', align: 'left', width: 89 },
        { text: 'DESCRIPCION', value: 'descripcion', align: 'left', width: 140 },
        { text: 'COMPROBANTE', value: 'cpr', align: 'left', width: 210},
        { text: 'TERCERO', value: 'tercero', align: 'left', width: 250},
        { text: 'IMPORTE', value: 'importe', align: 'end', width: 170},
//      { text: 'ACUMULADO', value: 'acumulado', align: 'end', width: 170},
      ],
      headersMed: [
        { text: 'MED', value:'medio.abrev', align: 'left', width: 80},
        { text: 'OBSERVACIONES', value:'observ', align: 'left', width: 580},
        { text: 'FECHA', value: 'fecha',  align: 'left', width: 120 },
        { text: 'TOTAL', value:'importe', align: 'end',  width: 120},
      ],
    }),

    watch: {
      '$store.state.sucursal' () {
        //this.contador = 1
        this.contador  = 1
        this.contadorPub = 1
        this.contadorGohu = 1
        //this.actualizarContador()
      },
      '$store.state.proveedor' () {
        //this.cambioProveedor(this.$store.state.proveedor)
      }
    },

    mounted() {
      this.$store.commit('closeAlert', { root: true })
      this.$store.commit('setHayCarrito', false, { root: true });
      if (this.isLoggedIn) {
        this.cambioSucursal(this.sucursales[this.sucursal])
      }
    },

    created() {
      this.$store.commit('setOfertas', false, { root: true });
      var self=this;
      this.contador = 1
      setInterval(function(){ self.actualizarContador() },1000)
      var self=this;
      this.contadorPub = 1;
      setInterval(function(){ self.actualizarContadorPub() },1000)
      var self=this;
      this.contadorGohu = 1;
      setInterval(function(){ self.actualizarContadorGohu() },1000)

      // crea o actualiza el dolar cada 15 minutos y lo hace desde las 10AM a 15AM
      // ergo, manda la consulta 20 veces por dia.
      var self=this;
      setInterval(function(){ self.actualizoMoneda() },900000) // 15 minutos

      if (this.isLoggedIn && !this.externo) {
        return HTTP().get('/vinculos/true').then(({ data }) => {
          this.setVinculos(data[0], data[1])
//        commit('setVinculosPadres', data[0], { root: true });
//        commit('setVinculosHijos', data[1], { root: true });
        })
      } else {
        this.$store.commit('setTemas', 'Invierno', { root: true });
      }
    },

    computed: {
      ...mapGetters('authentication', [
        'isLoggedIn', 'userName', 'userId',
      ]),
      ...mapState([
        'dolar',
        'externo',
        'inicial',
        'novedadesCprs',
        'novedadesGohu',
        'datosEmpresa',
        'timeoutRefresh',
        'sucursal',
        'sucursales',
        'proveedor',
        'proveedores',
        'sucursalDemo',
        'sucursalFiscal',
        'tema',
        'temas',
        'logotipo',
        'notificaciones',
        'notificacionesgohu',
        'caja',
        'tipo',
        'articulosViculados',
        'empresa',
        'operario',
        'operarioId',
        'operarioVendedor',
        'operarioTerceroId',
        'level',
        'porRem',
        'activo',
        'datosPanel',
        'vinculosPadres',
        'vinculosHijos',
        'carrusel',
        'roles',
        'contadorBloqueado',
        'hayCarrito',
        'grupoCarrito',
        'avatar',
        'graficos',
        'graficosDatos',
      ]),
    },

    methods: {
      ...mapActions('authentication', ['logout']),
      ...mapMutations
      ([
        'setDolar',
        'setNovedadesCprs',
        'setNovedadesGohu',
        'setSucursal',
        'setSucursales',
        'setProveedor',
        'setProveedores',
        'setSucursalFiscal',
        'setTimeoutRefresh',
        'setTema',
        'setTemas',
        'setLogotipo',
        'setNotificaciones',
        'setNotificacionesgohu',
        'setCaja',
        'setTipo',
        'setVinculosPadres',
        'setVinculosHijos',
        'setEmpresa',
        'setOperario',
        'setOperarioId',
        'setLevel',
        'setPorRem',
        'setActivo',
        'setDatosPanel',
        'setCarrusel',
        'setPublicaciones',
        'setContadorBloqueado',
        'setGraficos',
        'setGraficosDatos',
      ]),

      actualizarContador() {
        if (!this.isLoggedIn || this.$store.state.contadorBloqueado) { return }
        this.contador --
        let novCprs = 0
        let novUsrs = 0
        let novGohu = 0
        let compart = 0
        if (this.contador == 0) {
          this.contador = this.timeoutRefresh
          let n = []
          if (this.activo && !this.operarioVendedor) { // && this.userId!=1) {
            return HTTP().post('/notificaciones', {id: this.userId}, {timeout: 3000} ).then(({ data }) => {
              let cttPed = 0
              let totPed = 0
              let mismoTipoDeSucursal = false
              let agrego = false
              let cprvin = false
              this.notUsrs = []
              this.notCprs = []
              this.$store.commit('setDolar', data[0].dolar, { root: true });

              // limpio la cantidad de notificaciones
              for (let i=0; i<=this.menuNotUsrsNot.length-1; i++) {
                this.menuNotUsrsNot[i].nov = 0
              }
              for (let i=0; i<=data[0].not.length-1; i++) {
                agrego = false    // solo los del mismo tipo de sucursal (fiscal / demo )
                cprvin = false    // si tiene comprobante vinculado
                mismoTipoDeSucursal = false
                if (data[0].not[i].comprobante!=null) {
                  if (this.sucursalDemo === data[0].not[i].comprobante.sucursal.sucursaldemo) {
                    mismoTipoDeSucursal = true
                    agrego = true
                    cprvin = true
                  }
                } else {
                  agrego = true
                }

                switch (data[0].not[i].tipo) {
                  case '+': // nuevo usuario ( sin comprobante )
                    novGohu ++
                    //this.notUsrs.push({ usuario: data[i], borrada: false })
                    break
                  case 'A': // artículos nuevos ( sin comprobante )
                    novUsrs ++
                    this.menuNotUsrsNot[0].nov ++
                    if (data[0].not[i].detalles == 'Ya tiene disponible sus Artículos y Precios!') {
                      compart ++
                    }
                    break
                  case 'B': // Novedades de Pedidos ( viene con comprobante )
                    if (mismoTipoDeSucursal) {
                      novCprs ++
                    }
                    break
                  case 'C': break // Sin uso
                  case 'D': // Descargado por el proveedor ( viene con comproante )
                    if (mismoTipoDeSucursal) {
                      novCprs ++
                    }
                    break
                  case 'E': break // Sin uso
                  case 'F': // Pedido Facturado ( viene con comprobante )
                    if (mismoTipoDeSucursal) {
                      novCprs ++
                    }
                    break
                  case 'G': break // Factura Gohu ( viene con comprobatne ) - aun no implementada!.
                  case 'H': // Importar Cheques comprados ( viene con comprobante )
                    if (mismoTipoDeSucursal) {
                      novCprs ++
                    }
                    break
                  case 'I': // pago para importar ( viene con comprobante )
                    if (mismoTipoDeSucursal) {
                      novCprs ++
                    }
                    break
                  case 'J': 
                    break   // Mensajes de Usuarios ( viene con comprobante ) - Aún no implementado!.
                  case 'K': // Recibimos Stock ( viene con comprobante )
                    novCprs ++
                    break
                  case 'L': break // Sin uso
                  case 'M': // Solicitud de Pago ( viene con comprobante )
                    if (mismoTipoDeSucursal) {
                      novCprs ++
                    }
                    break
                  case 'N': break // Sin uso
                  case 'O': break // Sin uso
                  case 'P': // Pedidos ( viene con comprobante asignado )
                    if (mismoTipoDeSucursal) {
                      cttPed ++
                      totPed += data[0].not[i].comprobante.total
                      novCprs ++
                    }
                    break
                  case 'Q': break // Sin uso
                  case 'R': // Pago rechazado ( viene con comprobante asignado )
                    if (mismoTipoDeSucursal) {
                      novCprs ++
                    }
                    break
                  case 'S': break // Sin uso
                  case 'T': break // Sin uso
                  case 'U': break // Sin uso
                  case 'V': // Solicitud de Vinculo Comercial
                    novUsrs ++
                    this.menuNotUsrsNot[1].nov ++
                    break
                  case 'W': break // Sin uso
                  case 'Y': break // Sin uso
                  case 'Z': break // Sin uso
                }

                if (cprvin && agrego ) {  // Notificacion con comprobante vinculado

                  let u = this.notCprs.findIndex(x=>x.usuario==data[0].not[i].userdesde.username)
                  if (u==-1) {
                    this.notCprs.push({
                      usuario: data[0].not[i].userdesde.username,
                      user_id: data[0].not[i].userdesde.id,
                      cttPedidos: 0,
                      cttPedFac: 0,
                      cttLeidos: 0,
                      novedades: [{
                        comprobante: data[0].not[i].comprobante,
                        comprobante_id: data[0].not[i].comprobante_id,
                        created_at: data[0].not[i].created_at,
                        detalles: data[0].not[i].detalles,
                        estado: data[0].not[i].estado,
                        id: data[0].not[i].id,
                        tipo: data[0].not[i].tipo,
                        updated_at: data[0].not[i].updated_at,
                        user_id_desde: data[0].not[i].user_id_desde,
                        user_id_hasta: data[0].not[i].user_id_hasta,
                        userdesde: data[0].not[i].userdesde,
                        verarticulos: false,
                        verpendientes: false,
                        vercancelaciones: false,
                        vervalingresos: false,
                        vervalegresos: false,
                        paraprocesar: false,
                        notas: [{
                          fecha: data[0].not[i].created_at,
                          nota: data[0].not[i].detalles,
                          tipo: data[0].not[i].tipo,
                          borrada: false,
                          id: data[0].not[i].id,
                        }],
                      }]
                    })

                  } else {
                    
                    let q = this.notCprs[u].novedades.findIndex(x=>x.comprobante.cpr==data[0].not[i].comprobante.cpr)
                    if (q==-1) {
                      this.notCprs[u].novedades.push({
                        comprobante: data[0].not[i].comprobante,
                        comprobante_id: data[0].not[i].comprobante_id,
                        created_at: data[0].not[i].created_at,
                        detalles: data[0].not[i].detalles,
                        estado: data[0].not[i].estado,
                        id: data[0].not[i].id,
                        tipo: data[0].not[i].tipo,
                        updated_at: data[0].not[i].updated_at,
                        user_id_desde: data[0].not[i].user_id_desde,
                        user_id_hasta: data[0].not[i].user_id_hasta,
                        userdesde: data[0].not[i].userdesde,
                        verarticulos: false,
                        verpendientes: false,
                        vercancelaciones: false,
                        vervalingresos: false,
                        vervalegresos: false,
                        paraprocesar: false,
                        paraprocesar: false,
                        notas: [{
                          fecha: data[0].not[i].created_at,
                          nota: data[0].not[i].detalles,
                          tipo: data[0].not[i].tipo,
                          borrada: false,
                          id: data[0].not[i].id,
                        }],
                      })
                    } else {
                      this.notCprs[u].novedades[q].notas.push({
                        fecha: data[0].not[i].created_at,
                        nota: data[0].not[i].detalles,
                        tipo: data[0].not[i].tipo,
                        borrada: false,
                        id: data[0].not[i].id,
                      })
                    }
                  }
                }

                this.compartiendo = compart
                if (agrego) {
                  
                  this.notUsrs.push({ usuario: data[0].not[i], borrada: false })
                  let p = -1
                  if (cprvin) {
                    p = n.findIndex(x=>x.comprobante_id==data[0].not[i].comprobante_id)
                  }

                  if (p>=0) {
                    n[p].notas.push({
                      nota: data[0].not[i].detalles,
                      tipo: data[0].not[i].tipo,
                      id: data[0].not[i].id,
                    })
                  } else {
                    n.push( { 
                      comprobante: data[0].not[i].comprobante,
                      comprobante_id: data[0].not[i].comprobante_id,
                      created_at: data[0].not[i].created_at,
                      detalles: data[0].not[i].detalles,
                      estado: data[0].not[i].estado,
                      id: data[0].not[i].id,
                      tipo: data[0].not[i].tipo,
                      updated_at: data[0].not[i].updated_at,
                      user_id_desde: data[0].not[i].user_id_desde,
                      user_id_hasta: data[0].not[i].user_id_hasta,
                      userdesde: data[0].not[i].userdesde,
                      notas: [{
                        nota: data[0].not[i].detalles,
                        tipo: data[0].not[i].tipo,
                        id: data[0].not[i].id
                      }],
                      paraprocesar: false,
                    })
                  }
                }
              }

              // calculo los pedidos por usuarios
              for (let i=0; i<=this.notCprs.length-1; i++) {
                for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
                  if (this.notCprs[i].novedades[j].tipo=='P') {
                    this.notCprs[i].cttPedidos ++
                  } else if (this.notCprs[i].novedades[j].tipo=='F') {
                    this.notCprs[i].cttPedFac ++
                  } else if (this.notCprs[i].novedades[j].tipo=='B' ||
                              this.notCprs[i].novedades[j].tipo=='K' ||
                              this.notCprs[i].novedades[j].tipo=='R' ||
                              this.notCprs[i].novedades[j].tipo=='D' || this.externo) {
                    this.notCprs[i].cttLeidos ++
                  }
                }
              }
              if (cttPed>0) {
                this.$store.commit('setHayPedidos', cttPed, { root: true });
              } else {
                this.$store.commit('setHayPedidos', 0, { root: true });
              }
              for (let i=0; i<=n.length-1; i++) {
                for (let j=0; j<=n[i].notas.length-1; j++) {
                  if (n[i].notas[j].tipo == 'K' || //
                      n[i].notas[j].tipo == 'A' || 
                      n[i].notas[j].tipo == 'F' || 
                      n[i].notas[j].tipo == 'V' ||
                      n[i].notas[j].tipo == 'H') { n[i].paraprocesar = true; }
                  }
              }
              if (novUsrs+novGohu+novCprs>0) {
                this.$store.commit('setNotificaciones', n, { root: true });
                this.$store.commit('setNovedadesGohu', novGohu, { root: true });
                this.$store.commit('setNovedadesCprs', novCprs, { root: true });
              } else {
                this.$store.commit('setNotificaciones', [], { root: true });
                this.$store.commit('setNovedadesGohu', 0, { root: true });
                this.$store.commit('setNovedadesCprs', 0, { root: true });
              }

              return HTTP().get('/vinculos/true').then(({ data }) => {
                this.setVinculos(data[0], data[1])
                if (this.$store.state.level==3) {   // VENDEDOR
                  let aux = []
//                  let ter = this.$store.state.datosEmpresa.id
                  let ter = this.$store.state.operarioId
                  let suc = this.$store.state.sucursal
                  return HTTP().post('/roles',{ user: ter, sucursal: suc }).then(({ data }) => {
                    for (let i=0; i<=data.length-1; i++) {
                      aux.push ({
                        id:         data[i].id,
                        nombre:     data[i].opcion.nombre,
                        tipo:       data[i].opcion.tipo,
                        activo:     data[i].opcion.activo,
                        opcion_id:  data[i].opcion.id,
                        acceder:    i==0 ? true : data[i].acceder,
                        agregar:    i==0 ? true : data[i].agregar,
                        editar:     i==0 ? true : data[i].editar,
                        desactivar: i==0 ? true : data[i].desactivar,
                      })
                    }
                    this.$store.commit('setRoles', aux, { root: true });
                  })
                } else {
                  // SOLO PARA LOS NO VENDEDORES
                  // CARGO EL usuarios PARA PODER ADMINISTRAR JUSTAMENTE LOS USUARIOS
                  this.usuarios = this.vinculosPadresLoc.length>0 ? this.vinculosPadresLoc : this.vinculosHijosLoc
                  this.usuariosBkp = this.usuarios
                  this.vinculosPanel[0].ctt = 0  // nuevos
                  this.vinculosPanel[1].ctt = 0  // vinculados
                  this.vinculosPanel[2].ctt = 0  // descartados
                  this.vinculosPanel[3].ctt = 0  // solicitudes
                  // armo el array de rubros
                  this.rubros = []
                  for (let i=0; i<=this.usuarios.length-1; i++) {
                    // veo si el 'ver' esta en true
                    if (this.usuarios[i].ver==1 && this.usuarios[i].solicitud==0 && this.usuarios[i].vinculado==0) {
                      // nuevos
                      this.vinculosPanel[0].ctt+=1
                    } else if (this.usuarios[i].vinculado==1) {
                      // vinculados
                      this.vinculosPanel[1].ctt+=1
                    } else if (this.usuarios[i].ver==0) {
                      // descartados
                      this.vinculosPanel[2].ctt+=1
                    } else if (this.usuarios[i].solicitud==1) {
                      // solicitados
                      this.vinculosPanel[3].ctt+=1
                    }
                    for (let j=0; j<=this.usuarios[i].usersrubros.length-1; j++) {
                      let pos = this.rubros.findIndex(x=>x.id===this.usuarios[i].usersrubros[j].id)
                      if (pos==-1) {
                        this.rubros.push({
                          id: this.usuarios[i].usersrubros[j].id,
                          nombre: this.usuarios[i].usersrubros[j].nombre,
                          sel: false,
                        })
                      }
                    }
                  }
                  this.usuariosBkp = this.usuarios
                  this.vinculosVer(1)
                  if (this.usuarios.length==0) {
                    this.vinculosVer(2)
                    if (this.usuarios.length==0) {
                      this.vinculosVer(3)
                      if (this.usuarios.length==0) {
                        this.vinculosVer(4)
                      }
                    }
                  }
                }
              })
            })
          } else {
            this.$store.commit('setNotificaciones', [], { root: true });
          }
        }
      },

      actualizarContadorPub() {
        if (!this.isLoggedIn || this.$store.state.contadorBloqueado || !this.$store.state.ofertas) { return }
        this.contadorPub --
        if (this.contadorPub == 0) { //&& this.$store.state.proveedor.id) {
          this.contadorPub = 120;
          let filGrp = this.$store.state.grupoCarrito ? this.$store.state.grupoCarrito : 9999999
          if (this.$store.state.proveedor==undefined) {
            this.$store.commit('setPublicaciones', [], { root: true })
            return
          }
          if (this.$store.state.proveedor!='') {
            return HTTP().post('/publicaciones/', 
              {proveedor: this.$store.state.proveedor.id, filtro: filGrp } ).then(({ data }) => {
              let pub = []
              for (let i=0; i<=data.length-1; i++) {
                pub.push({
                  articulo: data[i].articulo,
                  articulo_id: data[i].articulo_id,
                  created_at: data[i].created_at,
                  envio: data[i].envio,
                  estado: data[i].estado,
                  fotos: data[i].fotos,
                  id: data[i].id,
                  precio: data[i].precio,
                  preciooriginal: data[i].preciooriginal,
                  tasadescuento: data[i].tasadescuento,
                  unidades: data[i].unidades,
                  updated_at: data[i].updated_at,
                  user_id: data[i].user_id,
                  vencimiento: data[i].vencimiento,
                  detalles: data[i].detalles,
                  vendidas: data[i].vendidas,
                  loquiero: false,
                  ctt: 0,
                })
              }
              this.$store.commit('setPublicaciones', pub, { root: true });
            })
          }
        }
      },

      actualizarContadorGohu() {
        if (!this.isLoggedIn) { return }
        this.contadorGohu --
        if (this.contadorGohu == 0) {
          this.contadorGohu = this.timeoutRefresh;
          let n = []
          if (this.isLoggedIn && this.userId==1) {
            return HTTP().get('/notificacionesgohu').then(({ data }) => {
              if (data.length>0) {
                for (let i=0; i<=data.length-1; i++) {
                  let p = -1
                  for (let j=0; j<=n.length-1; j++) {
                    if (data[i].comprobante_id == n[j].comprobante_id && n[j].tipo!='V') {
                      p = j
                      break
                    }
                  }
                  if (p>=0) {
                    n[p].notas.push( { nota: data[i].detalles, tipo: data[i].tipo } )
                  } else {
                    n.push( { 
                      comprobante: data[i].comprobante,
                      comprobante_id: data[i].comprobante_id,
                      created_at: data[i].created_at,
                      detalles: data[i].detalles,
                      estado: data[i].estado,
                      id: data[i].id,
                      tipo: data[i].tipo,
                      updated_at: data[i].updated_at,
                      user_id_desde: data[i].user_id_desde,
                      user_id_hasta: data[i].user_id_hasta,
                      userdesde: data[i].userdesde,
                      notas: [ { nota: data[i].detalles, tipo: data[i].tipo } ],
                      paraprocesar: false
                    })
                  }
                }
                // reviso cuales notifiaciones estan listas para procesar asi Home.vue 
                // puede prender los botones de ver e importar.
                for (let i=0; i<=n.length-1; i++) {
                  for (let j=0; j<=n[i].notas.length-1; j++) {
                    if (n[i].notas[j].tipo == 'K' ||
                        n[i].notas[j].tipo == 'A' ||
                        n[i].notas[j].tipo == 'F' ||
                        n[i].notas[j].tipo == 'V' || 
                        n[i].notas[j].tipo == 'H') {
                      n[i].paraprocesar = true;
                    }
                  }
                }
                this.$store.commit('setNotificacionesgohu', n, { root: true });
                this.mosNotGohu = true;
              } else  {
                this.$store.commit('setNotificacionesgohu', [], { root: true });
                this.mosNotGohu = false;
              }
            })
          } else {
            this.$store.commit('setNotificacionesgohu', [], { root: true });
          }
        }
      },

      vinculosVer(cual) {
        this.usuarios = []
        let rubsel = []
        let aux = []
        for (let i=0; i<=this.rubros.length-1; i++) {
          if (this.rubros[i].sel) {
            rubsel.push(this.rubros[i].id)
          }
        }
        if (rubsel.length==0) {
          for (let i=0; i<=this.rubros.length-1; i++) {
            rubsel.push(this.rubros[i].id)
          }
        }

        this.vinculosAVerCual = cual
        if (cual==1) {          // nuevos
          aux = this.usuariosBkp.filter(function(u){
            return (u.ver==1 && u.solicitud==0 && u.vinculado==0)
          })
        } else if (cual==2) {   // vinculados
          aux = this.usuariosBkp.filter(function(u){
            return (u.vinculado==1)
          })
        } else if (cual==3) {   // descartados
          aux = this.usuariosBkp.filter(function(u){
            return (u.ver==0)
          })
        } else if (cual==4) {   // solicitudes
          aux = this.usuariosBkp.filter(function(u){
            return u.solicitud==1 && u.ver==1
          })
        }

        // ver como optimizar esto!
        if (rubsel.length>0) {
          for (let i=0; i<=aux.length-1; i++) {
            for (let j=0; j<=aux[i].usersrubros.length-1; j++) {
              let pos = rubsel.indexOf(aux[i].usersrubros[j].id)
              if (pos!=-1) {
                this.usuarios.push(aux[i])
                break
              }
            }
          }
        } else {
          this.usuarios = aux
        }
      },

      async actualizoMoneda() {
        let hora = moment().format('HH:mm')
        if (hora>='08:00' && hora<='17:00') {
          this.yaLeyoElDolar = true
          this.cotDolar = []
          return axios.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales').then(({ data }) => {
            return HTTP().post('/cotizaciondolar', { dolar: data }).then(({ data }) => {
              if (data) {
                this.$store.commit('setDolar', data[0][0].nooficialventa, { root: true });
              }
            })
          })
        }
      },

      setTercero(cual) {
        this.$store.commit('setTerceros', cual, { root: true });
      },

      ophab(cual) {
        if (this.externo) return false  // Si el usuario es externo no tiene roles.
        if (this.$store.state.roles.length>0) {
          const op = this.$store.state.roles.map(el => el.opcion_id);
          const po = op.indexOf(cual);
          if (po==-1) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      },

      cprOrigen( nov ) {
        if (nov.comprobante.vinculoHijo.length>0) {
          if (nov.comprobante.cpr != nov.comprobante.vinculoHijo[0].padre.cpr) {
            return nov.comprobante.cpr //+' de '+nov.comprobante.vinculoHijo[0].padre.cpr
          } else {
            return nov.comprobante.cpr 
          }
        } else {
          return nov.comprobante.cpr
        }
      },

      showNotCprs() {
        this.dialogNotCprs = true
      },

      cambiarACuentaGohu() {
        this.dialogCambiarAGohu = true
      },

      showNotGohu() {
        this.dialogNotGohu = true
      },

      showUsuariosNuevos() {
        if (this.usuarios.length) {
          this.$store.commit('setContadorBloqueado', true, { root: true })
          this.dialogUsuarios = true
        }
      },

      setContadores() {
        this.contador = 1
        this.contadorGohu = 1
        this.contadorPub = 1
      },

      setGraficos() {
        if (!this.$store.state.graficos) {
          return HTTP().post('/resumenesdeventas/', {suc: this.$store.state.sucursal } ).then(({ data }) => {
            this.$store.commit('setGraficos', !this.$store.state.graficos, { root: true });
            for (let i=0; i<=data[0].length-1; i++) {
              data[0][i].fecha = moment(data[0][i].fecha).format('YYYY-MM-DD')
            }
            let primerDia = moment(data[0][0].fecha).format('YYYY-MM-DD')
            let ultimoDia = moment().format('YYYY-MM-DD')
            let actual = primerDia
            let dias = []
            this.resMeses = []
            let semanas = moment().weeks()
            let otro = moment().add(0, 'month').startOf('month').weeks() + 1
            while (actual<=ultimoDia) {
              let pos = data[0].findIndex(x=>x.fecha == actual)
              if (pos==-1) {
                dias.push({ fecha: actual, total: 0 })
              } else {
                dias.push({ fecha: actual, total: data[0][pos].total })
              }
              actual = moment(actual).add(1, 'days').format('YYYY-MM-DD')
            }
            this.$store.commit('setGraficosDatos', dias, { root: true })
          })
        } else {
          this.$store.commit('setGraficos', !this.$store.state.graficos, { root: true });        
          this.$store.commit('setGraficosDatos', [], { root: true })
        }
      },

      setEstadoFinanciero() {
        debugger
        return HTTP().post('/estadofinanciero/', {suc: this.$store.state.sucursal } ).then(({ data }) => {
          debugger
          this.estFin = []
          for (let i=0; i<=data.length-1; i++) {
            this.estFin.push({
              vencimiento: data[i].vencimiento,
              descripcion: data[i].descripcion,
              cpr: data[i].cpr,
              tercero: data[i].tercero,
              importe: data[i].importe,
              acumulado: 0,
            })
          }
          this.estFin.sort(function (a, b) {
            if (a.vencimiento < b.vencimiento) { return -1; }
            if (a.vencimiento > b.vencimiento) { return 1; }
            return 0;
          });

          // VAMOS A AGRUPAR POR FECHA FINANCIERA
          debugger
          this.estFinDia = []
          let acu = 0
          for (let i=0; i<=this.estFin.length-1; i++) {
            
            //let pos = tmp.findIndex(x=>x.vencimiento == this.estFin[i].vecimiento)
            let pos = -1
            for (let j=0; j<=this.estFinDia.length-1; j++) {
              if (this.estFinDia[j].vencimiento==this.estFin[i].vencimiento) {
                pos = j
                break
              }
            }
            acu += this.roundTo(this.estFin[i].importe,2)
            if (pos==-1) {
              this.estFinDia.push({
                vencimiento: this.estFin[i].vencimiento,
                debe: this.estFin[i].importe<0?this.roundTo(this.estFin[i].importe,2):0,
                haber: this.estFin[i].importe>0?this.roundTo(this.estFin[i].importe,2):0,
                saldo: 0,
                items: []
              })
              this.estFinDia[this.estFinDia.length-1].items.push(this.estFin[i])
              this.estFinDia[this.estFinDia.length-1].saldo = acu
            } else {
              this.estFinDia[pos].debe += this.estFin[i].importe<0?this.roundTo(this.estFin[i].importe,2):0
              this.estFinDia[pos].haber += this.estFin[i].importe>0?this.roundTo(this.estFin[i].importe,2):0
              this.estFinDia[pos].saldo = acu
              this.estFinDia[pos].items.push(this.estFin[i])
            }
          }

          this.estFinDia.sort(function (a, b) {
            if (a.vencimiento < b.vencimiento) { return 1; }
            if (a.vencimiento > b.vencimiento) { return -1; }
            return 0;
          });

          debugger
//          acu = 0
//          for (let i=this.estFin.length-1; i>=0; i--) {
//            acu += this.estFin[i].importe
//            this.estFin[i].acumulado = acu
//          }
          this.dialogEstadoFinanciero = true
        })
      },

      async verCotizaciones(ver) {
        this.dialogCotizaciones = ver
        this.cotDolar = []
        return axios.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales').then(({ data }) => {
          debugger
          for (let i=0; i<=data.length-1; i++) {
            if (data[i].casa.agencia=='349' || data[i].casa.agencia=='310') {
              this.cotDolar.push({ nombre: data[i].casa.nombre, compra: data[i].casa.compra, venta: data[i].casa.venta})
            }
          this.avisar = false
          }
        })
      },

      closeNotCprs() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogNotCprs = false
      },

      closeNotUsrs() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogNotUsrs = false
      },

      closeNotGohu() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogNotGohu = false
      },

      closeUsuarios() {
        this.$store.commit('setContadorBloqueado', false, { root: true })
        this.dialogUsuarios = false
      },

      leidosAll(nota) {
        let pos = this.notCprs.findIndex(x=>x.user_id===nota.user_id)
        for (let i=0; i<=this.notCprs[pos].novedades.length-1; i++) {
          if (this.notCprs[pos].novedades[i].tipo=='B' ||
              this.notCprs[pos].novedades[i].tipo=='K' ||
              this.notCprs[pos].novedades[i].tipo=='R' ||
              this.notCprs[pos].novedades[i].tipo=='D' ||
              this.externo) {
            this.leido(this.notCprs[pos].novedades[i],1)
          }
        }
      },

      leido(not,queArray) {
        return HTTP().post('/borrarnotificacion', { nota: not } )
          .then(({ data }) => {
            this.mensaje('¡Notificacion borrada!', this.$store.state.temas.forms_titulo_bg, 1500) 
            this.borroNotificacion(not,queArray)
        }).catch((e) => {
          //console.log(e)
          this.mensaje('¡La Notificacion no se ha podido eliminar!', this.$store.state.temas.forms_titulo_bg, 1500) 
        })
      },

      anular(not, queArray) {
  
        debugger
        if (not.comprobante.cpr.substring(0,3)=='PAG') {

          return HTTP().patch(`anularpago/${not.comprobante.id}`).then(({data}) => {
            this.mensaje(data, this.temas.forms_titulo_bg, 1500)
            return HTTP().post('/borrarnotificacion', { nota: not } )
              .then(({ data }) => {
                this.mensaje('¡Notificacion borrada!', this.$store.state.temas.forms_titulo_bg, 1500) 
                this.borroNotificacion(not,queArray)
              }).catch((e) => {
              //console.log(e)
              this.mensaje('¡La Notificacion no se ha podido eliminar!', this.$store.state.temas.forms_titulo_bg, 1500) 
            })
          }).catch((e) => {
            this.mensaje('¡Se ha producido el error '+e, this.$store.state.temas.forms_titulo_bg, 1500) 
          });

        } else if (not.comprobante.cpr.substring(0,3)=='PED') {

          debugger

          let xxx = not.comprobante

          return HTTP().post('/anularpedido', {
            itemActual: not,
            motivo: 'Lementamos informarles que nos quedamos sin Stock.',
            yadescargo: false,
            }).then(({ data })=>{

            debugger

            this.borroNotificacion(not,queArray)
            if (data) {
              this.mensaje('¡Pedido anulado correctamente!', this.temas.forms_titulo_bg, 1500)
            } else {
              this.mensaje('¡Opps, se ha producido un error al anular el pedido!', this.temas.forms_titulo_bg, 1500)
            }
            this.listarHTTP(false)
          });
        }
      },

      actualizoProveedores() {
        return HTTP().get('/vinculos/true').then(({ data }) => {
          this.setVinculos(data[0], data[1])
        })
      },

      verArt(nov) {
        if (nov) {
          nov.verarticulos = !nov.verarticulos
          this.dialogVerArticulos = true
          this.$store.commit('setContadorBloqueado', false, { root: true })
          for (let i=0; i<=this.notCprs.length-1; i++) {
            for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
              if (this.notCprs[i].novedades[j].verarticulos) {
                this.$store.commit('setContadorBloqueado', true, { root: true })
                break
              }
            }
          }
          this.articulos = nov.comprobante.items
          return nov.verarticulos
        } else {
          this.dialogVerArticulos = false
          this.$store.commit('setContadorBloqueado', false, { root: true })
        }
      },

      verPend(nov) {
        if (nov) {
          if (nov.comprobante.pendientes.length>0) {
            nov.verpendientes = !nov.verpendientes
            this.pendientes = nov.comprobante.pendientes
            this.dialogVerPendientes = true
          } else {
            nov.vercancelaciones = !nov.vercancelaciones
            this.cancelaciones = nov.comprobante.cancelaciones
            this.valoresEgresos = nov.comprobante.valoresEgresos
            this.dialogVerCancelaciones = true
          }
          this.$store.commit('setContadorBloqueado', false, { root: true })
          for (let i=0; i<=this.notCprs.length-1; i++) {
            for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
              if (nov.comprobante.pendientes.length>0) {
                if (this.notCprs[i].novedades[j].verpendientes) {
                  this.$store.commit('setContadorBloqueado', true, { root: true })
                  break
                }
              } else {
                if (this.notCprs[i].novedades[j].vercancelaciones) {
                  this.$store.commit('setContadorBloqueado', true, { root: true })
                  break
                }
              }
            }
          }
          if (nov.comprobante.pendientes.length>0) {
            return nov.verpendientes
          } else {
            return nov.vercancelaciones
          }
        } else {
          this.dialogVerPendientes = false
          this.dialogVerCancelaciones = false
          this.$store.commit('setContadorBloqueado', false, { root: true })
        }
      },

      formatoFecha(value) {
        return moment(String(value)).format('L')
      },

      diasVencido(value) {
        var dateOne = moment();
        var dateTwo = moment(value);
        return dateOne.diff(dateTwo, 'days');
      },

      totalNota(nota) {
        if (nota.comprobante.pendientes.length) {
          if (nota.comprobante.pendientes[0].pendiente==0) {
            return this.formatoImporte(nota.comprobante.pendientes[0].importe)
          } else {
            return this.formatoImporte(nota.comprobante.pendientes[0].pendiente)
          }
        } else {
          return this.formatoImporte(nota.comprobante.total)
        }
      },

      aceptarRechazarPlan(nota, aceptar) {
        this.$store.commit('actNotificacion', nota.usuario.id, { root: true });
        nota.borrada = true
        let pos = -1
        for (let i=0; i<=this.notUsrs.length-1; i++) {
          if (this.notUsrs[i].usuario.id == nota.usuario.id) {
            pos = i
            break
          }
        }
        if (pos!=-1) {
          this.notUsrs.splice(pos, 1);
        }
        this.$store.commit('setNovedadesGohu', this.$store.state.novedadesGohu-1, { root: true });
        if (this.notUsrs.length == 0) {
          this.dialogNotGohu = false
        }
        return HTTP().patch('activarrechazarusuario/'+nota.usuario.user_id_desde, {activo: aceptar}).then(({ data }) => {
          this.mensaje('¡Activación exitosa!', this.$store.state.temas.forms_titulo_bg, 2500) 
        })
        .catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500) 
        });
      },

      uneteAGohu() {
        this.dialogUneteAGohu = true
      },

      impCprAll(nota) {
        let pos = this.notCprs.findIndex(x=>x.user_id===nota.user_id)
        for (let i=0; i<=this.notCprs[pos].novedades.length-1; i++) {
          if (this.notCprs[pos].novedades[i].tipo=='P' || this.notCprs[pos].novedades[i].tipo=='F') {
            this.impCpr(this.notCprs[pos], this.notCprs[pos].novedades[i])
          }
        }
      },

      impCpr(not, it) {

        debugger
        let articulos = []
        let pendientes = []
        let valores = []
        for (let i=0; i<=it.comprobante.items.length-1; i++) {
          articulos.push(it.comprobante.items[i])
          articulos[i].deposito_id = null
        }

        debugger
        return HTTP().get('/empresa/'+it.user_id_desde).then(({ data }) => {

          debugger
          this.$store.commit('actNotificacion', it.id, { root: true });
          if (it.comprobante.tipo=='CO') {

            let novedad = {
              cpr_id: it.comprobante.id,
              novedad: 'Recepción del pedido',
              rel_id: null,
              estado: 'N',
              accion: 'ACTUALIZA',
            }
            return HTTP().post('/nuevaventa', {
              fecha: moment().format('YYYY-MM-DD'),    // it.comprobante.fecha.substring(0,10),
              perfiscal: moment().format('YYYYMM'),    // it.comprobante.perfiscal,
              tipo: 'VE',
              cpr: it.comprobante.cpr,
              user_id: this.userId,
              sucursal_id: this.$store.state.sucursal,
              tercero_id: data[0].tercero_id,
              comprobante_id: it.comprobante.comprobante_id,
              direccion_id: it.userdesde.tercero.direcciones[0].id,
              documento_id: it.comprobante.documento_id,
              mediodepago_id: it.comprobante.mediodepago_id,
              lista_id: null,
              deposito_id: null,
              vendedor: {id: null, nombre: 'MOSTRADOR'},
              moneda_id: it.comprobante.moneda_id,
              tasadescuento: it.comprobante.tasadescuento,
              importedescuento: it.comprobante.importedescuento,
              observaciones: it.comprobante.observaciones,
              retiva: 0,
              retgan: 0,
              retib: 0,
              gravado: it.comprobante.gravado,
              exento: it.comprobante.exento,
              iva: it.comprobante.iva,
              total: it.comprobante.total,
              regstk: true,
              estado: 'R',
              activo: true,
              articulos: articulos,
              valores: [],
              pendientes: [],
              notificacion: it.id,
              anotadorId: null,
              espejo: [],
              novedad: novedad,
            }).then(({ data }) => {
              this.mensaje('¡Importación Exitosa!', this.$store.state.temas.forms_titulo_bg, 1500) 
              this.borroNotificacion(it,1)
            });

          } else if (it.comprobante.tipo=='VE') {

            if (it.comprobante.observaciones=='VENTA DE CHEQUES') {

              pendientes = []
              articulos = []
              valores = []

              for (let i=0; i<=it.comprobante.valoresEgresos.length-1; i++) {
                it.comprobante.valoresEgresos[i].fechafinanciera = moment(it.comprobante.valoresEgresos[i].fechafinanciera).format('YYYY-MM-DD')
                it.comprobante.valoresEgresos[i].fechasalida = null
              }

              return HTTP().post('/compranueva', {
                fecha: it.comprobante.fecha.substring(0,10),
                perfiscal: it.comprobante.perfiscal.substr(0,4)+'-'+it.comprobante.perfiscal.substr(4,2),
                tipo: 'CO',
                cpr: 'CIN-X '+this.$store.state.sucursalFiscal+'-00000000',
                user_id: this.userId,
                sucursal_id: this.$store.state.sucursal,
                tercero_id: data[0].tercero.id,
                comprobante_id: it.comprobante.comprobante_id,
                direccion_id: it.comprobante.direccion_id,
                documento_id: it.comprobante.tercero.documento_id,
                mediodepago_id: 1,
                lista_id: null,
                deposito_id: null,   // mando como null, luego la api vera a que deposito de la sucursal imputa.
                vendedor_id: null,
                moneda_id: it.comprobante.moneda_id,
                tasadescuento: 0, importedescuento: 0, retiva: 0, retgan: 0, retib: 0, gravado: 0, exento: 0, iva: 0,
                total: it.comprobante.total,
                observaciones: 'COMPRA DE CHEQUES',
                regstk: false,
                estado: 'F',
                activo: true,
                articulos: [],
                valores: it.comprobante.valoresEgresos,                 // ESTO ESTA MAL, PUEDE VENIR EN EFECTIVO U OTROS VALORES
                pendientes:  [],
                notificaEnBaseAOtro: [],
                notificacion: it.id,
                gasto: null,
              }).then(({ data }) => {
                this.mensaje('¡Importación Exitosa!', this.$store.state.temas.forms_titulo_bg, 1500)
                this.borroNotificacion(it,1)
              });

            } else {

              // REGLA, CUANDO SE RECIBE UN COMPROBANTE DE VENTA DE UN PROVEEDOR, ( FAC PED )
              // SIEMPRE SE AGREGARA EN LA CUENTA CORRIENTE PARA QUE LUEGO SE REALICE EL PAGO.
              // SALVO QUE EL CREDITO NO SEA SUFICIENTE, EN ESE CASO SE AGREGA TAMBIEN EFECTIVO EN VALORES.
              let venc = moment().format('YYYY-MM-DD')
              let obsv = ''
              if (it.comprobante.pendientes.length>0) {
                venc = moment(it.comprobante.pendientes[0].vencimiento).format('YYYY-MM-DD')
              }
              // ACA TENGO QUE AGREGAR PENDIENTES SI HAY Y/O VALORES SI TAMBIEN HAY
              // ESTAN EL IT.COMPROBANTE.PENDIENTES Y IT.COMPROBANTE.VALORESINGRESOS
              if (it.comprobante.cpr.substr(0,3)!='PED') {
                obsv = 'COMPRA IMPORTADA'
                if (it.comprobante.pendientes.length>0) {
                  pendientes.push({ 
                    vencimiento: venc,
                    importe: it.comprobante.pendientes[0].importe,
                    pendiente: it.comprobante.pendientes[0].pendiente,
                    concepto: 'EN CUENTA CORRIENTE'
                  })
                }
                if (it.comprobante.valoresIngresos.length>0) {
                  valores.push(it.comprobante.valoresIngresos)
                }
              } else {
                obsv = 'PEDIDO'
              }

              // INVIERTO EL SINGNO ( VER SI CUANDO VIENE NDC VIENEN POSITIVOS )
              let coef = 1
              if (it.comprobante.cpr.substr(0,3)=='NDC') {
                coef = -1
              }
              for (let i=0; i<=articulos.length-1; i++) {
                articulos[i].stock = Math.abs(articulos[i].stock) * coef
              }

              // tengo que ver si es una compra o un gasto
              let pos = it.userdesde.tercero.usersterceros.findIndex(x => x.tercero_id==data[0].tercero.id)
              let cogs = 'CO'
              if (it.userdesde.tercero.usersterceros[pos].tipo_id==7) {
                cogs = 'GS'
              } 

              return HTTP().post('/compranueva', {
                fecha: it.comprobante.fecha.substring(0,10),
                perfiscal: it.comprobante.perfiscal.substr(0,4)+'-'+it.comprobante.perfiscal.substr(4,2),
                tipo: cogs,
                cpr: it.comprobante.cpr,
                user_id: this.userId,
                sucursal_id: this.$store.state.sucursal,
                tercero_id: data[0].tercero.id,
                comprobante_id: it.comprobante.comprobante_id,
                direccion_id: it.comprobante.direccion_id,
                documento_id: it.comprobante.tercero.documento_id,
                mediodepago_id: it.comprobante.mediodepago_id,
                lista_id: null,
                deposito_id: null,   // mando como null, luego la api vera a que deposito de la sucursal imputa.
                vendedor_id: null,
                moneda_id: it.comprobante.moneda_id,
                tasadescuento: it.comprobante.tasadescuento,
                importedescuento: it.comprobante.importedescuento,
                retiva: 0,
                retgan: 0,
                retib: 0,
                gravado: it.comprobante.gravado,
                exento: it.comprobante.exento,
                iva: it.comprobante.iva,
                total: it.comprobante.total,
                observaciones: obsv,
                regstk: true,
                estado: 'F',
                activo: true,
                articulos: articulos,
                valores: valores,                 // ESTO ESTA MAL, PUEDE VENIR EN EFECTIVO U OTROS VALORES
                pendientes: pendientes,
                notificacion: it.id,
                tasasIVA: it.comprobante.afipiva
              }).then(({ data }) => {
                
                this.mensaje('¡Importación Exitosa!', this.$store.state.temas.forms_titulo_bg, 1500) 
                this.borroNotificacion(it,1)
              });

            }

          } else if (it.comprobante.tipo=='PG') {

            it.sucursalFiscal = this.$store.state.sucursalFiscal
            it.sucursal       = this.$store.state.sucursal
            it.caja           = this.$store.state.caja
            let notificacion  = this.$store.state.notificaciones

            return HTTP().post('/importarrecibo', { it, notificacion }).then(({ data }) => {

              debugger
              this.msg.msgTitle = '¡Importación Correcta!'
              let m = '<br>¡El Pago ha sido bajado correctamente!.<br>'
              m = '<br>Los valores incluidos en el mismo ya estan disponibles en tu sistema!<br>'
              m += '<br>Se genero el Recibo '+data.cpr+' cancelando la Cuenta Corriente!<br>'
              this.msg.msgBody = m
              this.msg.msgVisible = true
              this.msg.msgAccion = 'generacion de recibo correcta'
              this.msg.msgButtons = ['Aceptar']

//            this.mensaje('¡Importación Exitosa!', this.$store.state.temas.card_ventas_bg, 1500) 
              this.borroNotificacion(it,1)
            });
          }
        })
      },

      rechazarCpr(nov) {
        this.detRechazo = ''
        this.itemActual = nov
        this.dialogRechazarCpr = true
      },

      cancelarRechazoCpr(not, it) {
        this.dialogRechazarCpr = false
      },

      closeUneteAGohu(not, it) {
        this.dialogUneteAGohu = false
      },

      closeVerCotizaciones() {
        this.dialogCotizaciones = false
      },

      confirmarRechazoCpr() {
        this.dialogRechazarCpr = false
        return HTTP().post('/rechazarcpr', { nota: this.itemActual, motivo: this.detRechazo }).then(({ data }) => {
          this.mensaje('¡Se ha enviado el rechazo correctamente!', this.$store.state.temas.forms_titulo_bg, 1500) 
          this.borroNotificacion(this.itemActual,1)
        });
      },

      borroNotificacion(not,queArray) {
        debugger
        if (queArray==1) {  //borra del this.notCprs
          not.borrada = true
          let n = []
          for (let i=0; i<=this.notCprs.length-1; i++) {
            n.push({
              usuario: this.notCprs[i].usuario,
              novedades: []
            })
            for (let j=0; j<=this.notCprs[i].novedades.length-1; j++) {
              if (this.notCprs[i].novedades[j].id != not.id ) {
                n[n.length-1].novedades.push({
                  comprobante: this.notCprs[i].novedades[j].comprobante,
                  comprobante_id: this.notCprs[i].novedades[j].comprobante_id,
                  created_at: this.notCprs[i].novedades[j].created_at,
                  detalles: this.notCprs[i].novedades[j].detalles,
                  estado: this.notCprs[i].novedades[j].estado,
                  id: this.notCprs[i].novedades[j].id,
                  notas: this.notCprs[i].novedades[j].notas,
                  paraprocesar: this.notCprs[i].novedades[j].paraprocesar,
                  tipo: this.notCprs[i].novedades[j].tipo,
                  updated_at: this.notCprs[i].novedades[j].updated_at,
                  user_id_desde: this.notCprs[i].novedades[j].user_id_desde,
                  user_id_hasta: this.notCprs[i].novedades[j].user_id_hasta,
                  userdesde: this.notCprs[i].novedades[j].userdesde,
                  verarticulos: this.notCprs[i].novedades[j].verarticulos,
                  vercancelaciones: this.notCprs[i].novedades[j].vercancelaciones,
                  verpendientes: this.notCprs[i].novedades[j].verpendientes,
                  vervalegresos: this.notCprs[i].novedades[j].vervalegresos,
                  vervalingresos: this.notCprs[i].novedades[j].vervalingresos,
                })
              }
            }
          }
          this.notCprs = n
          this.$store.commit('setNovedadesCprs', this.novedadesCprs-1, { root: true });
          if (this.notCprs.findIndex(x => x.novedades.length>0)) {
            this.dialogNotCprs = false
            this.$store.commit('setHayPedidos', 0, { root: true });
          }
        } else {  // borra del this.notUsrsSel
          this.contador = 1
          this.actualizarContador()
        }
      },

      verCpr(it) {
        this.$refs.impresion.ventasPrint(it, 'el');
      },

      enviarAExcel(nov) {
        // preparo
        let enviar = []
        enviar.push({
          enviadopor: nov.userdesde.username,
          comprobante: nov.comprobante.cpr,
        })
        for (let i=0; i<=nov.comprobante.items.length-1; i++) {
          enviar.push({
            articulo: nov.comprobante.items[i].articulo.codigo,
            nombre: nov.comprobante.items[i].articulo.nombre,
            unidades: nov.comprobante.items[i].cantidad,
            precio: nov.comprobante.items[i].precio,
            total: nov.comprobante.items[i].total,
          })
        }
        let d = XLSX.utils.json_to_sheet(enviar)
        const workbook = XLSX.utils.book_new()
        const filename = nov.comprobante.cpr
        XLSX.utils.book_append_sheet(workbook, d, filename)
        XLSX.writeFile(workbook, `${filename}.xlsx`)
      },

      fechaTimeLine(value) {
        return moment(String(value)).format('D MMM-YY h:mm a')
      },

      formatoImporte(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

      cambioProveedor(cual) {
        if (cual) {
          if (cual.id == 0) {
            this.$store.commit('setPublicaciones', [], { root: true });
            this.$store.commit('setProveedor', 0, { root: true });
          } else {
            // HEV aca debo actualizar el proveedor actual por si cambio el preciosconiva
            //operarioVendedor: this.$store.state.operarioVendedor,
            return HTTP().post('/releoproveedorparaelstate/', { proveedor: cual.id }).then(({ data })=>{
              this.$store.commit('setProveedor', data[0], { root: true });
//            if (!this.$store.state.operarioVendedor) {
//              this.$store.commit('setProveedores', provs, { root: true });
//            }
              this.$store.commit('setPublicaciones', [], { root: true });
              this.$store.commit('setGrupoCarrito', 9999999, { root: true });
              let filGrp = 9999999 //this.GrupoCarrito ? this.grupoCarrito : 9999999
              return HTTP().post('/publicaciones/', { proveedor: cual.id, filtro: filGrp }).then(({ data }) => {
                let pub = []
                for (let i=0; i<=data.length-1; i++) {
                  pub.push({
                    articulo: data[i].articulo,
                    articulo_id: data[i].articulo_id,
                    created_at: data[i].created_at,
                    envio: data[i].envio,
                    estado: data[i].estado,
                    fotos: data[i].fotos,
                    id: data[i].id,
                    precio: data[i].precio,
                    preciooriginal: data[i].preciooriginal,
                    tasadescuento: data[i].tasadescuento,
                    unidades: data[i].unidades,
                    updated_at: data[i].updated_at,
                    user_id: data[i].user_id,
                    vencimiento: data[i].vencimiento,
                    detalles: data[i].detalles,
                    vendidas: data[i].vendidas,
                    loquiero: false,
                    ctt: 0,
                  })
                }
                this.$store.commit('setPublicaciones', pub, { root: true });
              })
            })
          }
        }
      },

      cambioSucursal(cual) {
        if (cual==undefined) return 
        if (cual.id==undefined) return
        for (let i=0; i<=this.sucursales.length-1; i++) {
          if (this.sucursales[i].id == cual.id) {
            this.$store.commit('setSucursalFiscal',this.sucursales[i].fiscal, { root: true })
            this.$store.commit('setTemas',this.sucursales[i].tema, { root: true })
            this.$store.commit('setSucursalDemo',this.sucursales[i].sucursaldemo, { root: true })
            break
          }
        }
        this.$store.commit('setSucursal', cual.id, { root: true });

        return HTTP().get('/userscaja/'+this.sucursal).then(({data}) => {
          this.$store.commit('setCaja',data[0].id, { root: true })

//          return HTTP().post('/datosparaelpanel', { sucursal: this.sucursal } ).then(({ data }) => {
//            if (data.length>0) {
//              this.$store.commit('setDatosPanel', {
//                ventasDelDia:         data[0].ventasDelDia,
//                ventasCttCbtesDelDia: data[0].ventasCttCbtesDelDia,
//                ventasDelMes:         data[0].ventasDelMes,
//                ventasCttCbtesDelMes: data[0].ventasCttCbtesDelMes,
//                comprasDelMes:        data[0].comprasDelMes,
//                gastosDelmes:         data[0].gastosDelmes,
//                debAVencer:           data[0].debAVencer,
//                debVencidos:          data[0].debVencidos,
//                creAVencer:           data[0].creAVencer,
//                creVencidos:          data[0].creVencidos,
//                anotador:             data[0].anotador,
//                pedCantidad:          data[0].pedCantidad,
//                pedTotal:             data[0].pedTotal,
//              }, { root: true });
//            }

            if (this.$store.state.level==3) {
              let aux = []
              for (let i=0; i<=this.roles.length-1; i++) {
                aux.push ( {
                  id:         this.roles[i].id,
                  nombre:     this.roles[i].nombre,
                  tipo:       this.roles[i].tipo,
                  activo:     this.roles[i].activo,
                  opcion_id:  this.roles[i].opcion_id,
                  acceder:    i==0 ? true : false,
                  agregar:    i==0 ? true : false,
                  editar:     i==0 ? true : false,
                  desactivar: i==0 ? true : false,
                  state:      this.roles[i].state, 
                })
              }
              return HTTP().post('/roles',{ tercero: this.$store.state.operarioId, sucursal: cual.id }).then(({ data }) => {
                for (let i=0; i<=data.length-1; i++) {
                  for (let j=0; j<=aux.length-1; j++) {
                    if (data[i].opcion_id == aux[j].opcion_id) {
                      aux[j].acceder = data[i].acceder
                      aux[j].agregar = data[i].agregar
                      aux[j].editar = data[i].editar
                      aux[j].desactivar = data[i].desactivar
                      break
                    }
                  }
                }
                this.$store.commit('setRoles', aux, { root: true });
              })
            }
//          })
        })
      },

      async actualizoRoles(cual) {
        let aux = []
        for (let i=0; i<=this.roles.length-1; i++) {
          aux.push ( {
            id:         this.roles[i].id,
            nombre:     this.roles[i].nombre,
            tipo:       this.roles[i].tipo,
            activo:     this.roles[i].activo,
            opcion_id:  this.roles[i].opcion_id,
            acceder:    i==0 ? true : false,
            agregar:    i==0 ? true : false,
            editar:     i==0 ? true : false,
            desactivar: i==0 ? true : false,
            state:      this.roles[i].state, 
          })
        }
        return HTTP().post('/roles',{ 
          tercero: this.$store.state.operarioId,
          sucursal: this.sucursales[this.sucursal].id }).then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            for (let j=0; j<=aux.length-1; j++) {
              if (data[i].opcion_id == aux[j].opcion_id) {
                aux[j].acceder = data[i].acceder
                aux[j].agregar = data[i].agregar
                aux[j].editar = data[i].editar
                aux[j].desactivar = data[i].desactivar
                break
              }
            }
          }
          this.$store.commit('setRoles', aux, { root: true });
        })
      },

      getEstadoDelVinculo(us) {
        let ret = ''
        if (us.vinculado==1) {
          ret = us.pausado ? 'Pausado' : 'Activo'
          return ret
        }
        if (us.solicitud==1) {
          return us.esElQue == 'Envía' ? 'Esperando aprobación' : 'Esperando tu aprobación'
        } else if (us.ver==0) {
          return 'Descartado'
        }
      },

      usuarioDejarDeVer(usuario) {
        return HTTP().post('/vinculodejardever', { vinculo: usuario.vinculo_id }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
          } else {
            this.mensaje('El usuario paso a ser invisible!', this.$store.state.temas.forms_titulo_bg, 2500)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id===usuario.vinculo_id)
            if (pos!=-1) {
              this.usuarios[pos].ver = 0
            }
            this.vinculosPanel[this.vinculosAVerCual-1].ctt --
            this.vinculosPanel[2].ctt ++  // descartados
            this.vinculosVer(1)
            if (this.usuarios.length==0) {
              this.vinculosVer(3)
            }
          }
        }).catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
        });
      },

      usuarioVerDeNuevo(usuario) {
        return HTTP().post('/vinculoverdenuevo', { vinculo: usuario.vinculo_id }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
          } else {
            this.mensaje('El usuario se ha vuelto a activar!', this.$store.state.temas.forms_titulo_bg, 2500)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id===usuario.vinculo_id)
            if (pos!=-1) {
              this.usuarios[pos].ver = 1
            }
            this.vinculosPanel[0].ctt ++  // nuevos
            this.vinculosPanel[2].ctt --  // descartados
            this.vinculosVer(3)
            if (this.usuarios.length==0) {
              this.vinculosVer(1)
            }
          }
        }).catch((e) => {
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)
        });
      },

      enviarSolicitudVinculo() {
        this.dialogSolicitarVinculo = false
        if (this.nuevoVinculo.accesolibre==1) {
          return HTTP().post('/vinculoaceptar', { 
            usuario: this.nuevoVinculo.user_id,
            vinculo: this.nuevoVinculo.vinculo_id,
            notificacion: this.nuevoVinculo.notificacion_id }).then(({ data }) => {
            if (data=='ok') {
              return HTTP().get('/vinculos/true').then(({ data }) => {
                this.setVinculos(data[0], data[1])
                this.mensaje('¡El vículo se ha generado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
                if (this.nuevoVinculo.accesolibre!=1) {
                  this.vinculosPanel[3].ctt --  // solicitudes
                }
                this.vinculosPanel[1].ctt ++  // vinculados
                let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
                this.usuarios[pos].solicitud = 0
                this.usuarios[pos].vinculado = 1
                this.vinculosVer(2)
              })
            } else if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2000)
            }
          })
        } else {
          return HTTP().post('/vinculosolicitar', { usuario: this.nuevoVinculo.user_id }).then(({ data }) => {
            if (data=='ok') {
              this.mensaje('¡La solicitud Se ha enviado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.vinculosPanel[0].ctt --  // nuevos
              this.vinculosPanel[3].ctt ++  // solicitudes
              let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
              this.usuarios[pos].solicitud = true
              this.vinculosVer(4)
            } else if (data=='error') {
              this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2000)
            }
          })
        }
      },

      aceptarSolicitudDeVinculo() {
        this.dialogAceptarVinculo = false
        return HTTP().post('/vinculoaceptar', { 
          usuario: this.nuevoVinculo.user_id,
          vinculo: this.nuevoVinculo.vinculo_id,
          notificacion: this.nuevoVinculo.notificacion_id }).then(({ data }) => {
          if (data=='ok') {
            return HTTP().get('/vinculos/true').then(({ data }) => {
              this.setVinculos(data[0], data[1])
              this.mensaje('¡El vículo se ha generado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.vinculosPanel[3].ctt --  // solicitudes
              this.vinculosPanel[1].ctt ++  // solicitudes
              let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
              this.usuarios[pos].solicitud = 0
              this.usuarios[pos].vinculado = 1
              this.vinculosVer(2)
            })
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2000)
          }
        })
      },

      aceptarPausarVinculo() {
        this.dialogPausarVinculo = false
        return HTTP().post('/vinculopausar', { usuario: this.nuevoVinculo.vinculo_id }).then(({ data }) => {
          if (data=='ok') {
            this.mensaje('¡El vínculo ha sido pausado!', this.$store.state.temas.forms_titulo_bg, 2000)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
            this.usuarios[pos].pausado = 1
            this.actualizoProveedores()
            this.vinculosVer(2)
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2000)
          }
        })
      },

      aceptarReanudarVinculo() {
        this.dialogReanudarVinculo = false
        return HTTP().post('/vinculoreanudar', { usuario: this.nuevoVinculo.vinculo_id }).then(({ data }) => {
          if (data=='ok') {
            this.mensaje('¡El vínculo ha sido reanudado!', this.$store.state.temas.forms_titulo_bg, 2000)
            let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
            this.usuarios[pos].pausado = 0
            this.actualizoProveedores()
            this.vinculosVer(2)
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2000)
          }
        })
      },

      cancelarVinculo() {
        this.dialogCancelarVinculo = false
        return HTTP().post('/vinculocancelar', { vinculo: this.nuevoVinculo.vinculo_id }).then(({ data }) => {
          if (data=='ok') {
            return HTTP().get('/vinculos/true').then(({ data }) => {
              this.setVinculos(data[0], data[1])
              this.mensaje('¡El vículo se ha cancelado con éxito!', this.$store.state.temas.forms_titulo_bg, 2000)
              this.vinculosPanel[0].ctt ++  // nuevos
              this.vinculosPanel[1].ctt --  // vinculados
              let pos = this.usuarios.findIndex(x=>x.vinculo_id==this.nuevoVinculo.vinculo_id)
              this.usuarios[pos].solicitud = 0
              this.usuarios[pos].vinculado = 0
              this.vinculosVer(1)
            })
          } else if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2000)
          }
        })
      },

      usuarioSolicitarVinculo(usuario) {
        this.dialogSolicitarVinculo = true
        this.nuevoVinculo = usuario
      },

      usuarioAceptarVinculo(usuario) {
        this.dialogAceptarVinculo = true
        this.nuevoVinculo = usuario
        let uid = this.$store.state.tipo=='MI' ? usuario.user_id : this.userId
        return HTTP().get('/vinculoarticulosatransferir/'+uid)
          .then(({ data }) => {
            if (data!=null) {
              this.transferirArticulosCtt = data
            }
          })

      },

      usuarioMasInformacion(usuario) {
        this.nuevoVinculo = usuario
        this.dialogMasInformacion = true
        return HTTP().post('/vinculomasinformacion/', {id: usuario.user_id}).then(({data})=>{
          this.masInfo.razonSocial = data[0].tercero.razon_social
          this.masInfo.direccion = data[0].tercero.direcciones[0].direccion
          this.masInfo.localidad = data[0].tercero.direcciones[0].postal.nombre
          this.masInfo.provincia = data[0].tercero.direcciones[0].postal.provincia.nombre
          this.masInfo.tipoDeResponsable = data[0].tercero.responsable.nombre
          this.masInfo.cuit = data[0].tercero.cuit
          this.masInfo.calificacion = data[0].meta.promedio
          this.masInfo.observ = data[0].observ
          this.masInfo.enGohuDesdeEl = data[0].created_at
          debugger
          this.masInfo.contactos = data[0].tercero.contactos
          if (this.$store.state.tipo=='MI') {
            this.masInfo.cttUsrsVinculados = data[0].meta.vinculos_count
          } else {
            this.masInfo.cttUsrsVinculados = 0
          }
          this.masInfo.cttArticulos = data[0].meta.precios_count
          this.masInfo.cttPublicaciones = data[0].meta.publicaciones_count
          this.masInfo.cttPedidos = data[0].meta.comprobantes_count
        })
      },

      usuarioCancelarVinculo(usuario) {
        this.dialogCancelarVinculo = true
        this.nuevoVinculo = usuario
      },

      usuarioPausarVinculo(usuario)  {
        this.dialogPausarVinculo = true
        this.nuevoVinculo = usuario
        // aca debo buscar la catidad de articulos a transferir
      },

      usuarioReanudarVinculo(usuario)  {
        this.dialogReanudarVinculo = true
        this.nuevoVinculo = usuario
        // aca debo buscar la catidad de articulos a transferir
      },

      closeSolicitarVinculo() {
        this.dialogSolicitarVinculo = false
      },

      closeAceptarVinculo() {
        this.dialogAceptarVinculo = false
      },

      closePausarVinculo() {
        this.dialogPausarVinculo = false
      },

      closeReanudarVinculo() {
        this.dialogReanudarVinculo = false
      },

      closeCancelarVinculo() {
        this.dialogCancelarVinculo = false
      },

      closeMasInformacion() {
        this.dialogMasInformacion = false
      },

      mensaje(mensaje, color, tiempo) {
        this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
        setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
      },

      ofertasOnOff() {
        this.$store.commit('setOfertas', !this.$store.state.ofertas, { root: true });
        if (this.proveedores.length==1) {
          this.$store.commit('setPublicaciones', [] , { root: true})
        }
      },

      setVinculos(padres, hijos) {
        let pad = []
        let hij = []
        for (let i=0; i<=padres.length-1; i++) {
          if (padres[i].vinculado && !padres[i].pausado) {
            pad.push(padres[i].user_id)
          }
        }
        for (let i=0; i<=hijos.length-1; i++) {
          if (hijos[i].vinculado && !hijos[i].pausado) {
            hij.push(hijos[i].user_id)
          }
        }
        this.vinculosPadresLoc = padres
        this.vinculosHijosLoc = hijos
        this.$store.commit('setVinculosPadres', pad, { root: true });
        this.$store.commit('setVinculosHijos', hij, { root: true });

        let losProv = []
        if (this.operarioVendedor==false) {
          losProv.push({
            avatar:'Sin Avatar.jpg',id:0,nombre:'SIN SELECCIONAR',preciosconiva:0,tercero_id:null,administragohu:false
          })
        }
        for (let i=0; i<= padres.length-1; i++) {
          if (padres[i].vinculado && !padres[i].pausado) {
            losProv.push({
              avatar:         padres[i].avatar,
              id:             padres[i].user_id,
              nombre:         padres[i].nombre,
              preciosconiva:  padres[i].preciosconiva,
              tercero_id:     padres[i].tercero_id,
              administragohu: padres[i].administragohu,
            })
          }
        }
        if (!this.$store.state.proveedor.id) {
          this.$store.commit('setProveedor', losProv[0] , { root: true})
        }
        this.$store.commit('setProveedores', losProv , { root: true})
      },

      filtrarPorRubro(rub) {
        let pos = this.rubros.map(function(e) { return e.id; }).indexOf(rub.id);
        this.rubros[pos].sel = !this.rubros[pos].sel
        this.vinculosVer(this.vinculosAVerCual)
      },

      confirmarCuentaAGohu() {
        this.dialogCambiarAGohu = false
        return HTTP().post('/cambiaracuentagohu')
          .then(({ data }) => {
            if (data==='ok') {
              this.msg.msgTitle = '¡Activación Correcta!'
              let m = '<br>¡Ya eres usuario <b>gohu</b>!<br>'
              m += 'El sistema se cerrará automaticamente para preparar tu cuenta.<br>'
              m += 'Solo vuelve a ingresar y listo.<br>'
              this.msg.msgBody = m
              this.msg.msgVisible = true
              this.msg.msgAccion = 'activacion correcta'
              this.msg.msgButtons = ['Aceptar']
            } else {
              this.msg.msgTitle = '¡Activación incorrecta!'
              let m = 'Se ha producido un error en la activacion de tu cuenta.</b><br>'
              m += 'Reintenta, si el error persistema comunícate con <b>gohu</b>'
              this.msg.msgBody = m
              this.msg.msgVisible = true
              this.msg.msgAccion = 'activacion incorrecta'
              this.msg.msgButtons = ['Aceptar']
            }
          })
      },

      msgRespuesta(op) {
        this.msg.msgVisible = false;
        if (op==='Aceptar') {
          if (this.msg.msgAccion=='activacion correcta') {
            this.logout()
          }
        }
      },

      desdeEnGohu(){
        return moment(this.masInfo.enGohuDesdeEl).format('DD/MM/YYYY')
      },

      diasEnGohu(){
        let f1 =  moment().format('YYYY-MM-DD')
        let f2 =  this.masInfo.enGohuDesdeEl
        let hoy = moment(f1)
        let ven = moment(f2)
        let d = hoy.diff(ven, 'days')
        return d
      },

      formatoFechaCorta(value) {
        return moment(String(value)).format('DD-MM-YY')
      },

      roundTo(value, places){
       var power = Math.pow(10, places);
       return Math.round(value * power) / power;
      },

    }

  };
</script>

<style scoped>
  .contenedor-galeria{
    display: flex;
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: auto;
  }
  .galeria__img {
    width: 300px;
    height: 200px;
    margin-bottom: 30px;
    object-fit: cover;
    filter: brightness(100%);
    animation: escalar 1.5s infinite alternate;
  }
  @keyframes escalar {
    to {
      transform: scale(1)
    }
    from {
      transform: scale(1.01)
    }
    
  }
  .galeria__img:hover {
    filter: brightness(95%);
  }
  .titulo-proveedor {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 150%;
  }
  .titulo-notificacion {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .contenedor-galeria-fuente-importe {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .contenedor-galeria-fuente-descuento {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: red;
  }
  .contenedor-galeria-fuente-final {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: black;
    font-weight: 200%;
  }
  .contenedor-galeria-fuente-proveedor {
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
    color: black;
    font-weight: 80%;
  }
  .minifont {
    /*font-family: Verdana, Arial, Helvetica, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 84%;
  }
  .cpr {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-display: green;
    font-size: 75%;
  }
  .bigfont {
    font-family: Graphik,sans-serif;
    font-size: 1.375rem;
    line-height: 2.1rem;
    color: gray;
  }
  .v-btn::before {
    background-color: transparent;
  }
  .v-btn i:hover{
    transform: scale(1.25);
  }

</style>
