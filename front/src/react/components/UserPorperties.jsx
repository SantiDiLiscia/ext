import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native'
import styled from "styled-components/native";
import Carousel from "../components/Carousel";
import Boton from './../ui/Button'
import FadeInView from "../components/FadeInView";
import Loading from "../components/Loading";
import { fetchProperties } from '../../redux/actions/user'

const UserProperties = ({ propiedades, fetchProperties, user, navigation }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties(user.uid)
      .then(() => setLoading(false))
  }, [])


  const sendId = (id) => navigation.navigate(`SingleView`, { propertyId: id })
  const editSpace = (id) => navigation.push("EditSpace", { propertyId: id })

  if (!propiedades.length) return <Centered><Tit>Todavia no tenés propiedades!</Tit></Centered>

  return (
    <ScrollView>
      {!loading 
        ?
        <Wrapper>
          {propiedades.map((espacio, index) => {
            return (
              <FadeInView key={index} order={index}>
                <StyledView
                  key={index}
                  style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.27, shadowRadius: 4.65, elevation: 6 }}
                >
                  <View>
                    <View style={{
                      width: '100%',
                      height: (espacio.photos || []).length ? 250 : "auto",
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      overflow: "hidden"
                    }} >
                      <Carousel images={espacio.photos || []} height={250} />
                      {espacio.verified ? (<Verified style={{ position: "absolute", bottom: 5, right: 2, zIndex: 9 }}>
                        <Image source={require("../../public/icons/verificado-ve.png")} style={{ width: 40, height: 40 }} />
                      </Verified>) : null}
                    </View>
                    <ViewInfo>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => { return sendId(espacio.id) }}
                        >
                          <Titulo>{espacio.title}</Titulo>
                          {espacio.province === 'ciudad autónoma de buenos aires'
                            ? <Subtitulo>{`${espacio.neighborhood} - Capital Federal - ${espacio.size}mtr2`}</Subtitulo>
                            : <Subtitulo>{`${espacio.neighborhood} - ${espacio.province} - ${espacio.size}mtr2`}</Subtitulo>
                          }
                          <View style={{ margin: 0, alignItems: "flex-start", marginLeft: 2 }}>
                          </View>
                        </TouchableOpacity>

                      </View>
                      <View style={{ margin: 0, alignItems: "flex-start", marginLeft: 2 }}>
                        <TouchableOpacity onPress={() => navigation.navigate(`Comments`, { propertyId: espacio.id })}>
                          <Text
                            style={{ color: "grey", fontWeight: "bold", paddingLeft: 0, paddingTop: 10, paddingBottom: 10 }}
                          >{`${(espacio.comments || "").length || 0}  Ver comentarios`}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: "row" }}
                      >
                        <Precio>{`$${espacio.price}`}</Precio>
                        <Text style={{ alignSelf: 'center' }}>por hora</Text>
                      </View>

                      <DoubleWraper>
                        <Boton
                          onPress={() => { return sendId(espacio.id) }}
                          bg="#4A94EA"
                          color="#F7F7F7"
                          mr="5px"
                        >Mas Info.
                  </Boton>

                        <Boton
                          onPress={() => editSpace(espacio.id)}
                          bg="#F77171"
                          color="#F7F7F7"
                          mr="5px"
                        >Editar
                  </Boton>
                      </DoubleWraper>

                    </ViewInfo>

                  </View>
                </StyledView>
              </FadeInView>
            );
          })}
        </Wrapper>
        : <Loading />
      }
    </ScrollView>
  )
}


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.logged,
    propiedades: state.user.properties
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchProperties: (id) => dispatch(fetchProperties(id))
  }
}

const StyledView = styled.View`
  margin: 10px 5px;
  background-color: #F7F7F7;
  padding : 0;
  border-radius: 10px;
`
const Wrapper = styled.View`
  flex: 1;
  margin: 0px auto;
  width: 100%;
  padding: 0 8px;
  max-width: 500px;
`
const ViewInfo = styled.View`
padding: 18px;
`
const Precio = styled.Text`
  font-size: 20px;
  margin: 3px;
`
const Titulo = styled.Text`
  font-size: 17px;
  text-transform: capitalize;
  margin: 3px 3px 0px 3px;
`
const Subtitulo = styled.Text`
  font-size: 15px;
  font-weight: 100;
  text-transform: capitalize;
  color: grey;
  margin: 0 3px 3px 3px;
`
const Verified = styled.View`
`
const DoubleWraper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`

const Centered = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  align-items: center;
`
const Tit = styled.Text`
  font-size: 20px;
  font-weight: 100;
  color: grey;
  margin-top: 80px;
`

export default connect(mapStateToProps, mapDispatchToProps)(UserProperties)