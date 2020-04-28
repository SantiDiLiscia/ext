import React, { Component, useEffect, useState } from "react";
import { View } from "react-native";
import AddSpaceFormProgress from "../components/AddSpaceFormProgress";
import Picker from "../components/Picker";
import TextPrompt from "../components/TextPrompt";
import Typeahead from "../components/Typeahead";
import AddPhotos from "../components/AddPhotos";
import Form from "../components/Form";

import { fetchProvincias, fetchLocalidades, fetchCoords } from "../../redux/actions/locations";
import { addSpace } from '../../redux/actions/spaces'
import { connect } from 'react-redux'

const SpaceForm = ({ navigation, uploadFiles, addSpace, user, fetchLocalidades, fetchProvincias, fetchCoords }) => {
  const Type = Picker(useState(false), useState(""));
  const Services = Picker(useState(false), useState([]));
  const Observation = TextPrompt(useState(false), useState(""));
  const Rules = TextPrompt(useState(false), useState(""));
  const Descripcion = TextPrompt(useState(false), useState(""));

  console.log(user);

  /****************  Geo normalization **************/

  const [provincias, setProvincias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [province, setProvince] = useState({})
  const [region, setRegion] = useState({})

  function getProvincias(val) {
    fetchProvincias(val)
      .then(data => setProvincias(data))
  }


  function getLocalidades(val) {
    fetchLocalidades(val, province.id)
      .then(data => {
        const body = data.map((elemento) => {
          return { label: elemento.label, id: elemento.id }
        })
        setLocalidades(body);
      })
  }

  const handleSelectProvince = (val) => {
    if (!val) return setProvince({});
    setProvince(val);
  };

  /**************************************************/

  const onSubmit = function (form) {
    console.log(region)
    const datosSpace = {
      verificated: false,
      neighborhood: (form["Barrio*"] || {}).value,
      province: (form["Provincia*"] || {}).value,
      type: (form["Tipo de Espacio*"] || {}).value,
      street: (form["Calle*"] || {}).value,
      streetNumber: (form["Número"] || {}).value,
      floor: (form['Piso'] || {}).value,
      apt: (form['Depto'] || {}).value,
      size: (form["Tamaño #(mtr2)#*"] || {}).value,
      capacity: (form["Capacidad*"] || {}).value,
      price: (form["Valor hora ($)"] || {}).value,
      cleanup: (form["Tasa limpieza ($)*"] || {}).value,
      rules: (form["Reglas de Convivencia"] || {}).value,
      observations: (form["Observaciones"] || {}).value,
      description: (form["Descripcion"] || {}).value,
      userId: user.id,
      visible: false,
      location: [],
      photos: (form["Agregar fotos"] || {}).value || [],
      title: form["Titulo*"].value,
      services: form["Caracteristicas y servicios*"].value,
      comments: []
    };

    //navigation.navigate("PreviewSpace", { space: datosSpace })
    const coords = {
      p: datosSpace.province,
      n: datosSpace.neighborhood,
      s: datosSpace.street,
      sn: datosSpace.streetNumber
    }
    addSpace(datosSpace)
      .then((propertyId) => {
        fetchCoords(coords, propertyId, region)
          .then((data) =>
            navigation.navigate("Payment", { space: datosSpace, propertyId })
          )

      })

  }

  const fields = [
    ["Titulo*", "Excelente lugar para..."],
    [({ onChange }) => <Typeahead
      title="Provincia*"
      placeholder="Buenos Aires, Cordoba, San Luis.."
      getOptions={getProvincias}
      handleSelect={handleSelectProvince}
      onChange={onChange}
      options={provincias}
    />, 3],
    //[({ onChange }) => <Province.Input onChange={onChange} title={"Provincia*"} placeholder="Buenos Aires, Cordoba, San Luis.." />],
    [({ onChange }) => province.id ? <Typeahead
      title="Barrio*"
      placeholder="Flores, Saavedra.."
      getOptions={getLocalidades}
      handleSelect={() => null}
      onChange={onChange}
      options={localidades}
    /> : null, 2],
    ["Calle*", "Av. Congreso, Castillo"],
    [
      ["Número", "1332"],
      ["Piso", "4"],
      ["Depto", "B"]
    ],
    [
      ({ onChange }) => (
        <Type.Input
          onChange={onChange}
          title={"Tipo de Espacio*"}
          placeholder="Selecciona el espacio que ofrece."
        />
      )
    ],
    [
      ["Tamaño #(mtr2)#*", "mtr2"],
      ["Capacidad*", "Cant. personas"]
    ],

    [
      ({ onChange }) => (
        <Descripcion.Input
          onChange={onChange}
          title="Descripcion"
          placeholder="Breve descripcion del lugar..."
        />
      )
    ],
    [
      ({ onChange }) => (
        <Services.Input
          onChange={onChange}
          title={"Caracteristicas y servicios*"}
          placeholder="Wifi, Cafe, Snacks, TV, Aire Acond.."
        />
      )
    ],
    [
      ({ onChange }) => (
        <Observation.Input
          onChange={onChange}
          title="Observaciones"
          placeholder="Horarios disponibles, particularidades, etc."
        />
      )
    ],

    [
      ["Valor hora ($)", "$560"],
      ["Tasa limpieza ($)*", "$180"]
    ],

    [
      ({ onChange }) => (
        <Rules.Input
          onChange={onChange}
          title="Reglas de Convivencia"
          placeholder="Aclaraciones, límites, reglas del lugar..."
        />
      )
    ],
    [
      ({ title, onChange }) => (
        <AddPhotos
          text="Agregar fotos"
          navigation={navigation}
          onChange={onChange}
          title={title}
        />
      )
    ]
  ];

  return (
    <View style={{ flex: 1 }}>
      <Type.Modal
        title={"Tipo de Espacio*"}
        options={[
          "Casa",
          "Depósito",
          "Habitación",
          "Oficina",
          "Quinta",
          "Salón",
          "Terreno"
        ]}
      />
      <Services.Modal
        title={"Caracteristicas y servicios*"}
        options={[
          "Aire Acondicionado",
          "Wifi",
          "LCD",
          "Cafe/Infusiones",
          "Snacks",
          "Música",
          "Vajilla",
          "Baño",
          "Ducha"
        ]}
      />

      <Descripcion.Modal
        title={"Descripcion*"}
        placeholder={
          "Breve explicacion de el lugar que estas anadiendo, resalta las caracteristicas mas importantes."
        }
      />

      <Observation.Modal
        title={"Observaciones*"}
        placeholder={
          "Coloque aquí las observaciones y características del espacio para que lea su cliente. Sea breve y claro."
        }
      />

      <Rules.Modal
        title={"Reglas de convivencia"}
        placeholder={
          "Coloque aquí las reglas del espacio, los límites, si acepta o no mascotas, los temas de órden y limpieza, etc. Sea breve y claro."
        }
      />

      <Form
        name="space"
        onSubmit={onSubmit}
        fields={fields}
        header={({ divider }) => (
          <AddSpaceFormProgress
            title="Presentá tu espacio"
            state={1}
            divider={divider}
          />
        )}
        sendText="Siguiente"
      />
    </View>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.user.logged,

})

const mapDispatchToProps = (dispatch) => ({
  addSpace: (body) => dispatch(addSpace(body)),
  fetchProvincias: (val) => dispatch(fetchProvincias(val)),
  fetchLocalidades: (val, id) => dispatch(fetchLocalidades(val, id)),
  fetchCoords: (coordenadas, id, region) => dispatch(fetchCoords(coordenadas, id, region)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SpaceForm);
