import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import GuessLogItem from "../components/game/GuessLogItem";
import NumberContainer from "../components/game/NumberContainer";
import PrimaryButton from "../components/ui/PrimaryButton";
import Title from "../components/ui/Title";

function generateRandomBetween(min, max, exclude) {
  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum == exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
}

let minBoundary = 1;
let maxBoundary = 100;

const GameScreen = ({ userNumber, gameOverHandler }) => {
  const initialGuess = generateRandomBetween(1, 100, userNumber);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [guessRounds, setGuessRounds] = useState([initialGuess]);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (currentGuess === userNumber) {
      Alert.alert("Congrats!", "You made it...", [
        { text: "Thanks for playing!", style: "cancel" },
      ]);
      gameOverHandler(guessRounds.length);
    }
  }, [currentGuess, userNumber, gameOverHandler]);

  useEffect(() => {
    minBoundary = 1;
    maxBoundary = 100;
  }, []);

  function nextGuessHandler(direction) {
    if (
      (direction === "lower" && currentGuess < userNumber) ||
      (direction === "greater" && currentGuess > userNumber)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [
        { text: "Sorry!", style: "cancel" },
      ]);
      return;
    }

    if (direction === "lower") {
      maxBoundary = currentGuess;
    } else {
      minBoundary = currentGuess + 1;
    }
    const newRndNum = generateRandomBetween(
      minBoundary,
      maxBoundary,
      currentGuess
    );
    setCurrentGuess(newRndNum);
    setGuessRounds((prev) => [newRndNum, ...prev]);
  }

  const guessRoundsListLength = guessRounds.length;

  let content = (
    <>
      <NumberContainer>{currentGuess}</NumberContainer>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={[styles.title, { paddingBottom: 16 }]}>
          Higher or Lower?
        </Text>
        <View style={styles.buttonsContainer}>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
              <Ionicons name="md-remove" size={24} />
            </PrimaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={nextGuessHandler.bind(this, "greater")}>
              <Ionicons name="md-add" size={24} />
            </PrimaryButton>
          </View>
        </View>
      </View>
    </>
  );

  if (width > 500) {
    content = (
      <>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {/* <View>
            <Text style={styles.title}>Higher or Lower?</Text>
          </View> */}
          <View style={styles.buttonsContainerWide}>
            <View>
              <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
                <Ionicons name="md-remove" size={24} />
              </PrimaryButton>
            </View>
            <NumberContainer>{currentGuess}</NumberContainer>
            <View>
              <PrimaryButton onPress={nextGuessHandler.bind(this, "greater")}>
                <Ionicons name="md-add" size={24} />
              </PrimaryButton>
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <Title>Opponent's Guess</Title>
      {content}
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.listContainer, { padding: width > 500 ? 0 : 0 }]}>
          {/* {guessRounds.map((guessRound) => (
          <Text key={guessRound}>{guessRound}</Text>
        ))} */}
          <FlatList
            data={guessRounds}
            renderItem={(itemData) => (
              <GuessLogItem
                roundNumber={guessRoundsListLength - itemData.index}
                guess={itemData.item}
                marginVerticalHorizontal={width > 500 ? 2 : 8}
              />
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 56,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ddb52f",
    textAlign: "center",
    marginTop: 8,
    // borderWidth: 2,
    // borderColor: "#ddb52f",
    // padding: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonsContainerWide: { flexDirection: "row", alignItems: "center" },
  listContainer: {
    // padding: 16,
    // flex: 1,
  },
});
