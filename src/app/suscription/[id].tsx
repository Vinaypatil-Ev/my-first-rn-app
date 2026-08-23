import React from "react";
import { Text, View } from "react-native";

type subType = {
  id: string;
};

const suscriptions = ({ id }: subType) => {
  return (
    <View>
      <Text>Suscriptions Id: {id}</Text>
    </View>
  );
};

export default suscriptions;
