import React, { useEffect } from "react";
import { Button, Text, View, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { connect } from "react-redux";
import Icon from "../ui/Icon";

export default ({ navigation }) => {
  return (
    <Footer>

      <Tab>
        <TabIcon
          source={require('../../public/icons/settings.png')}
        />
      </Tab>
      <Tab>
        <TabIcon
          source={require('../../public/icons/history.png')}
        />
      </Tab>
      <Tab>
        <TabIcon
          source={require('../../public/icons/search.png')}
          onPress={() => navigation.push("SerchSpace")}
        />
      </Tab>
      <Tab>
        <TabIcon
          source={require('../../public/icons/user.png')}
          onPress={() => navigation.push("Profile")}
        />
      </Tab>
    </Footer>
  );
}

const Footer = styled.View`
  flex-direction: row;
  background-color: rgba(255,255,255,0.72);
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 60px;
  align-items: center;
  padding: 0 20px;

`

const Tab = styled.View`
  flex: 1;
  flex-grow: 1;
`

const TabIcon = styled(Icon)`
  align-self: center;
`