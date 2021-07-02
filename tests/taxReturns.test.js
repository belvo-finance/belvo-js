import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import TaxReturn from '../src/taxReturns';

const taxReturn = {
  collected_at: '2020-01-07T08:30:17.861202+00:00',
  informacion_general: {
    ejercicio: 2018,
    fecha_hora_presentacion: '2020-01-07T16:55:00-06:00',
    numero_operacion: '000000000001',
    periodo_declaracion: 'Del Ejercicio',
    rfc: 'ABC1111111A1',
    tipo_declaracion: 'Normal',
    tipo_complementaria: null,
    denominacion_razon_social: 'ACME CORP',
  },
  datos_adicionales: {
    indica_si_optas_por_dictaminar_tus_estados_financieros: 'NO',
    estas_obligado_a_presentar_la_informacion_sobre_tu_situacion_fiscal: 'NO',
    estas_obligado_unicamente_por_supuesto_distinto_al_de_haber_realizado_operaciones_con_residentes_extranjero: 'SIN SELECCIÓN',
    estas_obligado_unicamente_por_supuesto_distinto_al_de_haber_realizado_operaciones_con_residentes_extranjero_inferiores_100mdp: 'SIN SELECCIÓN',
    optas_por_presentar_informacion_sobre_tu_situacion_fiscal: 'SIN SELECCIÓN',
    indica_si_te_dedicas_exclisivamente_a_generacion_energia_fuentes_renovables_o_cogeneracion_electricidad_eficiente: 'NO',
  },
  estado_resultados: {
    ventas_servicios_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: 911165,
      total: 911165,
    },
    ventas_servicios_extranjero: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    devoluciones_descuentos_bonificaciones_ventas_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    devoluciones_descuentos_bonificaciones_ventas_extranjero: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    ingresos_netos: {
      partes_relacionadas: null,
      partes_no_relacionadas: 911165,
      total: 911165,
    },
    inventario_inicial: null,
    compras_netas_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    compras_netas_importacion: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    inventario_final: null,
    costo_mercancias: null,
    mano_de_obra: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    maquilas: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    gastos_indirectos_fabricacion: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    costo_ventas_servicios: null,
    utilidad_bruta: 911165,
    perdida_bruta: null,
    gastos_operacion: {
      partes_relacionadas: null,
      partes_no_relacionadas: 499540,
      total: 499540,
    },
    utilidad_operacion: 411625,
    perdida_operacion: null,
    intereses_devengados_a_favor_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    intereses_devengados_a_favor_extranjero: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    intereses_moratorios_a_favor_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    intereses_moratorios_a_favor_extranjero: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    ganancia_cambiaria: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    intereses_devengados_a_cargo_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    intereses_devengados_a_cargo_extranjero: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    intereses_moratorios_a_cargo_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    intereses_moratorios_a_cargo_extranjero: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    perdida_cambiaria: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    resultado_posicion_monetaria_favorable: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    resultado_posicion_monetaria_desfavorable: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    otras_operaciones_financieras_nacionales: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    otras_operaciones_financieras_extranjero: {
      partes_relacionadas: null,
      partes_no_relacionadas: null,
      total: null,
    },
    otras_operaciones_financieras: null,
    resultado_integral_financiamiento: null,
    otros_gastos_nacionales: null,
    otros_gastos_extranjero: null,
    otros_gastos: null,
    otros_productos_nacionales: null,
    otros_productos_extranjero: null,
    otros_productos: null,
    ingresos_partidas_discontinuas_extraordinarias: null,
    gastos_partidas_discontinuas_extraordinarias: null,
    utilidad_antes_impuesto: 411625,
    perdida_antes_impuesto: null,
    isr: 113002,
    ietu: null,
    impac: null,
    ptu: null,
    utilidad_participacion_subsidiaria: null,
    perdida_participacion_subsidiaria: null,
    efectos_reexpresion_favorables_excepto_resultado_posicion_monetaria: null,
    efectos_reexpresion_desfavorables_excepto_resultado_posicion_monetaria: null,
    utilidad_neta: 298623,
    perdida_neta: null,
  },
  estado_posicion_financiera_balance: {
    activo: {
      efectivo_caja_depositos_instituciones_credito_nacionales: 726644,
      efectivo_caja_depositos_instituciones_credito_extranjero: null,
      inversiones_valores_instituciones_nacionales_excepto_acciones: null,
      inversiones_valores_instituciones_extranjero_excepto_acciones: null,
      cuentas_documentos_por_cobrar_nacionales: {
        partes_relacionadas: null,
        partes_no_relacionadas: null,
        total: null,
      },
      cuentas_documentos_por_cobrar_extranjero: {
        partes_relacionadas: null,
        partes_no_relacionadas: null,
        total: null,
      },
      contribuciones_a_favor: null,
      inventarios: null,
      otros_activos_circulantes: 13277,
      inversiones_en_acciones_nacionales: null,
      inversiones_en_acciones_extranjero: null,
      inversiones_en_acciones_total: null,
      terrenos: null,
      construcciones: null,
      construcciones_en_proceso: null,
      maquinaria_y_equipo: null,
      mobiliario_y_equipo_oficina: null,
      equipo_de_computo: null,
      equipo_de_transporte: null,
      otros_activos_fijos: 12756,
      depreciacion_acumulada: -106,
      cargos_y_gastos_diferidos: 9319,
      amortizacion_acumulada: null,
      suma_activo: 761890,
    },
    pasivo: {
      cuentas_documentos_por_pagar_nacionales: {
        partes_relacionadas: null,
        partes_no_relacionadas: 268227,
        total: 268227,
      },
      cuentas_documentos_por_pagar_extranjero: {
        partes_relacionadas: null,
        partes_no_relacionadas: null,
        total: null,
      },
      contribuciones_por_pagar: 223490,
      anticipos_de_clientes: {
        partes_relacionadas: null,
        partes_no_relacionadas: null,
        total: null,
      },
      aportaciones_futuros_aumentos_de_capital: null,
      otros_pasivos: null,
      suma_pasivo: 491717,
    },
    capital_contable: {
      capital_social_proveniente_aportaciones: 10000,
      capital_social_proveniente_capitalizacion: null,
      reservas: null,
      otras_cuentas_capital: null,
      aportaciones_futuros_aumentos_de_capital: null,
      utilidades_acumuladas: null,
      utilidad_del_ejercicio: 298623,
      perdidas_acumuladas: -38450,
      perdida_del_ejercicio: null,
      exceso_en_actualizacion_capital: null,
      insuficiencia_en_actualizacion_capital: null,
      actualizacion_del_capital_contable: null,
      suma_capital_contable: 270173,
      suma_pasivo_mas_capital_contable: 761890,
    },
  },
  conciliacion_entre_resultado_contable_fiscal: {
    utilidad_o_perdida_neta: 298623,
    efectos_reexpresion: null,
    resultado_posicion_monetaria: null,
    utilidad_o_perdida_neta_historica: 298623,
    ingresos_fiscales_no_contables: 95,
    ajuste_anual_inflacion_acumulable: 95,
    anticipos_de_clientes: null,
    intereses_moratorios_efectivamente_cobrados: null,
    ganancia_en_enajenacion_acciones_por_reembolso_capital: null,
    ganancia_en_enajenacion_de_terrenos_y_activo_fijo: null,
    inventario_acumulable_del_ejercicio: null,
    otros_ingresos_fiscales_no_contables: null,
    deducciones_contables_no_fiscales: 117415,
    costo_de_ventas_contable: null,
    depreciacion_y_amortizacion_contable: 106,
    gastos_que_no_reunen_requisitos_fiscales: 4307,
    isr_ietu_impac_ptu: 113002,
    perdida_contable_enajenacion_de_acciones: null,
    perdida_contable_enajenacion_de_activo_fijo: null,
    perdida_en_participacion_subsidiaria: null,
    intereses_devengados_que_exceden_valor_mercado_y_moratorios_pagados_o_no: 0,
    otras_deducciones_contables_no_fiscales: 0,
    deducciones_fiscales_no_contables: 0,
    ajuste_anual_inflacion_deducible: null,
    costo_vendido_fiscal: null,
    deduccion_inversiones: null,
    estimulo_fiscal_por_deduccion_inmediata_inversiones: null,
    donacion_bienes_basicos_subsistencia_humana: 0,
    estimulo_fiscal_contratacion_personas_discapacidad_yo_mayores: 0,
    deduccion_impuesto_sobre_renta_retenido_personas_discapacidad_yo_mayores: 0,
    perdida_fiscal_en_enajenacion_acciones: null,
    perdida_fiscal_en_enajenacion_de_terrenos_y_activo_fijo: null,
    intereses_moratorios_efectivamente_pagados: null,
    otras_deducciones_fiscales_no_contables: null,
    ingresos_contables_no_fiscales: null,
    intereses_moratorios_devengados_a_favor_cobrados_o_no: null,
    anticipos_de_clientes_ejercicios_anteriores: null,
    saldos_a_favor_impuestos_y_su_actualizacion: null,
    utilidad_contable_enajenacion_de_activo_fijo: null,
    utilidad_contable_enajenacion_de_acciones: null,
    utilidad_en_participacion_subsidiaria: null,
    otros_ingresos_contables_no_fiscales: null,
    utilidad_o_perdida_fiscal_antes_de_ptu: 416133,
  },
  deducciones_autorizadas: {
    sueldos_salarios: null,
    honorarios_pagados_a_personas_fisicas: null,
    regalias_y_asistencia_tecnica: null,
    donativos_otorgados: null,
    uso_o_goce_temporal_de_bienes_pagados_a_personas_fisicas: null,
    fletes_y_acarreos_pagados_a_parsonas_fisicas: null,
    contribuciones_pagadas_excepto_isr_ietu_impac_iva_ieps: null,
    seguros_fianzas: null,
    perdida_por_creditos_incobrables: null,
    viaticos_y_gastos_viaje: 59527,
    combustible_y_lubricantes: null,
    credito_al_salario_no_disminuido_de_contribuciones: null,
    aportaciones_sar_infonavit_y_jubilaciones_vejez: null,
    aportaciones_para_fondos_de_pensiones_y_jubilaciones: null,
    cuotas_imss: null,
    consumos_en_restaurantes: 11254,
    perdida_por_operaciones_financieras_derivadas: null,
    deduccion_por_concepto_de_ayuda_alimentaria_para_trabajadores: null,
    monto_total_pagos_que_sean_ingresos_exentos_para_trabajador: null,
    monto_deducible_al_47_pagos_son_ingresos_exentos_para_trabajador: null,
    monto_deducible_al_53_pagos_son_ingresos_exentos_para_trabajador: null,
    uso_o_goce_temporal_de_automoviles_baterias_electricas_o_electricos_con_motor_combustion_o_hidrogeno: null,
    otras_deducciones_autorizadas: 424346,
    total_deducciones_autorizadas: 495127,
  },
  cifras_cierre_ejercicio: {
    perdidas_fiscales_de_ejercicios_anteriores_pendientes_de_amortizar_actualiazadas: null,
    saldo_promedio_anual_de_creditos: 142795,
    saldo_promedio_anual_de_deudas: 144765,
    coeficiente_de_utilidad_por_aplicar_en_ejercicio_siguiente: 0.4567,
    porcentaje_de_participacion_consolidable: null,
    isr_causado_en_exceso_del_impac_en_los_3_ejercicios_anteriores_pendientes_aplicar: null,
    saldo_actualizado_de_cuenta_de_utilidad_fiscal_neta_2013_y_anteriores: null,
    saldo_actualizado_de_cuenta_de_utilidad_fiscal_neta_a_partir_2014_y_anteriores: null,
    saldo_actualizado_de_cuenta_de_utilidad_fiscal_reinvertida: null,
    saldo_actualizado_de_cuenta_de_capital_de_aportacion: null,
    saldo_de_cuenta_de_utilidad_fiscal_neta_por_inversion_en_renovables: null,
  },
  determinacion_del_impuesto_sobre_la_renta: {
    determinacion_del_impuesto_sobre_la_renta: {
      total_ingresos_acumulables: 911260,
      total_deducciones_autorizadas_y_deduccion_inmediata_inversiones: 495126,
      deduccion_adicional_por_pago_servicios_personales_en_operacion_maquila: null,
      utilidad_o_perdida_fiscal_antes_de_ptu: 416134,
      ptu_pagada_en_el_ejercicio: null,
      utilidad_fiscal_del_ejercicio: 416134,
      perdidas_fiscales_de_ejercicios_anteriores_que_se_aplican_en_ejercicio: 39462,
      resultado_fiscal: 376672,
      impuesto_causado_en_ejercicio: 113002,
      tienes_estimulos_fiscales_a_acreditar: 'SIN SELECCIÓN',
      impuesto_sobre_la_renta_del_ejercicio: 113002,
      pagos_provisionales_efectuados_enterados_a_federacion: null,
      impuesto_retenido_al_contribuyente: null,
      impuesto_acreditable_pagado_en_extranjero: null,
      impuesto_acreditable_por_dividendos_o_utilidades_distribuidos: null,
      otras_cantidades_a_cargo: null,
      otras_cantidades_a_favor: null,
      diferencia_a_cargo: 113002,
      isr_a_cargo_del_ejercicio: 113002,
      isr_a_favor_del_ejercicio: null,
    },
    impuesto_sobre_ingresos_sujetos_a_regimenes_fiscales_preferentes: null,
    datos_informativos_ejercicio: {
      monto_aplicado_del_estimulo_fiscal_de_chatarrizacion: 0,
      monto_deducible_de_pagos_efectuados_por_uso_o_goce_temporal_automoviles: 0,
      impac_recuperado_en_ejercicio_derivado_de_deconsolidacion: 0,
      ingresos_obtenidos_por_apoyos_gubernamentales: 0,
      gastos_realidados_en_ejercicio_por_proyectos_en_investigacion_desarrollo_tecnologico: 0,
      credito_fiscal_autorizado_en_ejercicio_por_proyectos_en_investigacion_desarrollo_tecnologico_pendiente_aplicar: 0,
      credito_fiscal_autorizado_en_ejercicio_por_proyectos_de_inversion_en_artes_pendiente_aplicar: 0,
      credito_fiscal_autorizado_en_ejercicio_por_inversion_en_proyectos_programas_para_deporte_de_alto_rendimiento_pendiente_aplicar: 0,
      saldo_pendiente_aplicar_por_inversion_en_equipos_de_alimentacion_vehiculos_electricos: 0,
      credito_fiscal_autorizado_en_ejercicio_a_produccion_distribucion_cinematografica_nacional_pendiente_aplicar: 0,
    },
    datos_informativos_ejercicios_anteriores_aplicados_en_ejercicio: {
      total_estimulo_produccion_y_distribucion_cinematografica_nacional_ejercicios_anteriores_aplicado_en_ejercicio: null,
      saldo_credito_fiscal_autorizado_ejercicios_anteriores_por_inversion_en_proyectos_programas_para_deporte_alto_rendimiento_pendiente_aplicar: 0,
      saldo_credito_fiscal_autorizado_ejercicios_anteriores_por_proyectos_investigacion_desarrollo_tecnologico_pendiente_aplicar: 0,
      saldo_credito_fiscal_autorizado_ejercicios_anteriores_por_proyectos_inversion_artes_pendiente_aplicar: 0,
      saldo_credito_fiscal_autorizado_ejercicios_anteriores_a_produccion_distribucion_nacional_pendiente_aplicar: 0,
    },
  },
  dividendos_o_utilidades_distribuidos: {
    provenientes_de_cuenta_de_utilidad_fisica_neta_cufin_generada_en_2013_y_anteriores: null,
    provenientes_de_cuenta_de_utilidad_fisica_neta_cufin_generada_a_partir_de_2014: null,
    provenientes_de_cuenta_de_utilidad_fisica_neta_reinvertida_cufinre: null,
    no_provenientes_de_cufin_ni_cufinre_en_efectivo: null,
    no_provenientes_de_cufin_ni_cufinre_en_acciones: null,
    monto_del_impuesto_pagado_no_proveniente_de_cufin_ni_cufinre: null,
    monto_del_impuesto_pagado_de_utilidades_provenientes_de_cufinre: null,
    provenientes_de_cuenta_de_utilidad_fiscal_neta_por_inversion_en_energia_de_fuentes_renovables_o_sistemas_cogeneracion_electricidad_eficiente: null,
  },
  detalle_pago_r1_isr_personas_morales: {
    a_cargo: 113002,
    parte_actualizada: null,
    recargos: null,
    multa_por_correccion: null,
    total_contribuciones: 113002,
    desea_aplicar_alguna_compensacion_o_estimulo: 'NO',
    cantidad_a_cargo: 113002,
    opta_por_pagar_parcialidades: 'SIN SELECCIÓN',
    importe_de_primera_parcialidad: null,
    importe_sin_primera_parcialidad: null,
    cantidad_a_favor: null,
    cantidad_a_pagar: 113002,
  },
  pdf: null,
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class TaxReturnsAPIMocker extends APIMocker {
  replyWithListOfTaxReturns() {
    this.scope
      .get('/api/tax-returns/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [taxReturn],
        },
      );
    return this;
  }

  replyToTaxReturnDetail() {
    this.scope
      .get(`/api/tax-returns/${taxReturn.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, taxReturn);
  }

  replyToDeleteTaxReturn() {
    this.scope
      .delete(`/api/tax-returns/${taxReturn.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateTaxReturn() {
    this.scope
      .post('/api/tax-returns/', { link: linkId, year_from: 2019, year_to: 2020 })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxReturn);
  }

  replyToCreateTaxReturnWithType() {
    this.scope
      .post('/api/tax-returns/', { link: linkId, type: "yearly", year_from: 2019, year_to: 2020 })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxReturn);
  }

  replyToCreateTaxReturnWithDates() {
    this.scope
      .post('/api/tax-returns/', { link: linkId, type: 'monthly', date_from: '2020-01-01', date_to: '2020-03-30'})
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxReturn);
  }


  replyToCreateTaxReturnWithOptions() {
    this.scope
      .post('/api/tax-returns/', {
        link: linkId,
        year_from: 2019,
        year_to: 2020,
        save_data: false,
        token: 'token123',
        attach_pdf: false,
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxReturn);
  }

  replyToCreateTaxReturnWithDateOptions() {
    this.scope
      .post('/api/tax-returns/', {
        link: linkId,
        date_from: "2020-01-01",
        date_to: "2020-01-30",
        save_data: false,
        token: 'token123',
        attach_pdf: false,
        type: "monthly",
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxReturn);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/tax-returns/', { session: 'abc123', token: 'my-token', link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, taxReturn);
  }
}

const mocker = new TaxReturnsAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list tax returns', async () => {
  mocker.login().replyWithListOfTaxReturns();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const result = await taxReturns.list();

  expect(result).toEqual([taxReturn]);
});

test('can retrieve tax returns', async () => {
  mocker.login().replyToCreateTaxReturn();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const result = await taxReturns.retrieve(linkId, 2019, 2020);

  expect(result).toEqual(taxReturn);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve tax returns with type', async () => {
  mocker.login().replyToCreateTaxReturnWithType();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const result = await taxReturns.retrieve(linkId, 2019, 2020, {type:"yearly"});

  expect(result).toEqual(taxReturn);
  expect(mocker.scope.isDone()).toBeTruthy();
});


test('can retrieve tax returns with dates', async () => {
  mocker.login().replyToCreateTaxReturnWithDates();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const result = await taxReturns.retrieve(linkId, '2020-01-01', '2020-03-30', {type: 'monthly'});

  expect(result).toEqual(taxReturn);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve tax returns with options', async () => {
  mocker.login().replyToCreateTaxReturnWithOptions();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const options = {
    token: 'token123',
    saveData: false,
    attachPDF: false,
  };
  const result = await taxReturns.retrieve(linkId, 2019, 2020, options);

  expect(result).toEqual(taxReturn);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve tax returns  with dates and options', async () => {
  mocker.login().replyToCreateTaxReturnWithDateOptions();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const options = {
    token: 'token123',
    saveData: false,
    attachPDF: false,
    type: "monthly",
  };
  const result = await taxReturns.retrieve(linkId, "2020-01-01", "2020-01-30", options);

  expect(result).toEqual(taxReturn);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see tax return detail', async () => {
  mocker.login().replyToTaxReturnDetail();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const result = await taxReturns.detail(taxReturn.id);

  expect(result).toEqual(taxReturn);
});

test('can delete tax return', async () => {
  mocker.login().replyToDeleteTaxReturn();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const result = await taxReturns.delete(taxReturn.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume tax return session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const taxReturns = new TaxReturn(session);
  const result = await taxReturns.resume('abc123', 'my-token', linkId);

  expect(result).toEqual(taxReturn);
  expect(mocker.scope.isDone()).toBeTruthy();
});
