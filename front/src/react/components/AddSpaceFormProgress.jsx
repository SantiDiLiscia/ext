import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";


export default ({ title, state }) => {

	const states = ["Tus datos", "-", "Espacios", "-", "Planes"]

	return (
		<View>
			<Header>{title}</Header>
			<Container>
				{
					states.map((text, i) => {
						if (text == "-") return <Line key={i} />

						return <BadgeWrapper key={i}>
							{
								state > (i / 2) ?
									<Tick key={i} source={require('../../public/icons/tick.png')} />
									: <Badge key={i} showed={(state == i / 2) + ""}>{(i / 2) + 1}</Badge>
							}

							<BadgeTitle>{text}</BadgeTitle>
						</BadgeWrapper>
					}
					)
				}
			</Container>
			<Divider />
		</View>
	)
}

const Header = styled.Text`
	font-size: 15px;
	font-weight: 700;
	text-align: center;
	margin-bottom: 20px;
`

const Container = styled.View`
	flex-direction: row;
	justify-content: space-between;
	width: 70%;
	align-self: center;
	margin-bottom: 45px;
	margin-top: 8px;
`

const BadgeWrapper = styled.View`
	width: 51px;
	justify-content: center;
`

const Badge = styled.Text`
	width: 21px;
	height: 21px;
	border-radius: 50px;
	background-color: ${props => props.showed == "true" ? "#4A94EA" : "white"};
	border: ${props => props.showed == "true" ? "none" : "solid 1px #b2b2b2"};
	color: ${props => props.showed == "true" ? "white" : "#b2b2b2"};
	font-size: 12px;
	line-height: 21px;
	align-self: center;
	text-align: center;
`
const BadgeTitle = styled.Text`
	font-size: 12px;
	color: #b2b2b2;
	position: absolute;
	top: 25px;
	width: 100%;
	text-align: center;
`

const Line = styled.View`
  height: 1px;
  flex: 1;
  background-color: #b2b2b2;
  margin-top: 10px;
  margin-left: -15px;
  margin-right: -15px;
`

const Tick = styled.Image`
	width: 21px;
	height: 21px;
	border-radius: 50px;
	align-self: center;
	background-color: #4A94EA;
`
const Divider = styled.View`
  height: 1px;
  width: 100%;
  background-color: #b2b2b2;
  margin-bottom: 10px;
`