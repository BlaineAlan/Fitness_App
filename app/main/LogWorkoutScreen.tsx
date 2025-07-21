import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import { List, Provider as PaperProvider } from 'react-native-paper';
import { ColorWheel } from 'react-native-color-wheel';


const TitleInput = ({ value, onChangeText }) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSelectedOnce, setHasSelectedOnce] = useState(false);
  

  return (
    <View style={styles.TextBox}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => {
          setIsFocused(true);
          setHasSelectedOnce(false);
        }}
        onBlur={() => setIsFocused(false)}
        style={styles.TitleText}
        textAlign='center'
        selection={
          isFocused && !hasSelectedOnce 
          ? { start: 0, end: value.length }
          : undefined
        }
        onSelectionChange={() => {
          if (isFocused && !hasSelectedOnce) setHasSelectedOnce(true);
        }}
      />
    </View>
  );
};

const SetInput = ({ value, onChangeText }) => {
  return (
    <View style={styles.smallTextBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.smallText}
        textAlign='center'
        keyboardType='number-pad'
      />
    </View>
  );
};

const RepInput = ({ value, onChangeText }) => {
  return (
    <View style={styles.smallTextBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.smallText}
        textAlign='center'
        keyboardType='number-pad'
      />
    </View>
  );
};


const WeightInput = ({ value, onChangeText }) => {
  return(
    <View style={styles.WeightBox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.smallText}
        textAlign='center'
        keyboardType='number-pad'
      />
    </View>
  );
};

const Notes = ({ value, onChangeText }) => {
  return (
    <View style={styles.textbox}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.notestext}
        multiline={true}
        textAlignVertical='top'
        scrollEnabled={true}
      />
    </View>
  );
};

//Working kind of but cannot read property 'r' of null error keeps popping up.
const ColorSelector = ({ selectedColor, onColorChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor || '#ff0000');
  const [savedColors, setSavedColors] = useState(['#ff0000', '#00ff00', '#0000ff']);

  const addCustomColor = () => {
    if (!savedColors.includes(customColor)) {
      setSavedColors([...savedColors, customColor]);
    }
    onColorChange(customColor);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: selectedColor }}
        onPress={() => setModalVisible(true)}
      />
      <Modal visible={modalVisible} transparent={false} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text>Choose a Color</Text>

          {/* Saved Color Swatches */}
          <FlatList
            horizontal
            data={savedColors}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: 30, height: 30, margin: 5, borderRadius: 15, backgroundColor: item,
                  borderWidth: item === selectedColor ? 2 : 0,
                  borderColor: 'black'
                }}
                onPress={() => {
                  onColorChange(item);
                  setModalVisible(false);
                }}
              />
            )}
          />

          {/* Color Wheel */}
          <ColorWheel
            initialColor={customColor}
            onColorChangeComplete={c => setCustomColor(c)}
            style={{ width: 200, height: 200, marginVertical: 20 }}
          />

          {/* Save New Color */}
          <TouchableOpacity onPress={addCustomColor} style={{ padding: 10, backgroundColor: 'purple', borderRadius: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Add + Use Color</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


const LogWorkoutScreen = () => {
  const router = useRouter();
  const { selectedDate } = useLocalSearchParams();
  const [selectedColor, setSelectedColor] = useState('red');
  const [workoutName, setWorkoutName] = useState("New Workout Name");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sets, setSets] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [notes, setNotes] = React.useState('');

  
  const handleSave = () => {
    router.replace({
      pathname: '/',
      params: {
        selectedDate,
        workoutColor: selectedColor
      }
    });
  };

  const TopBorder = () => {
    return (  
      <View
        style={styles.border}
      />
    );
  };



  const DateInput = () => {
    return (
      <View style={styles.date}>
        <Text style={styles.text}>
          Date: {moment(selectedDate).format('MMMM D, YYYY')}
        </Text>
      </View>
    );
  };


  const BackButton = ( { onPress } ) => {
    return (
      <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.7}>
        <Image
          source={require('../../assets/images/back.png')}
          style={styles.image}
          transition={0}
          contentFit='contain'
        />
      </TouchableOpacity>
    );
  };

  const ExerciseDropdown = () => {
    const [expandedGroup, setExpandedGroup] = React.useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const handlePress = (group) => {
      setExpandedGroup(prev => (prev === group ? null : group));
    };

    const ExerciseData = {
      Back: {
        color: '#220530',
        exercises: ['Pull Ups', 'Deadlifts', 'Rows']
      },
      Arms: {
        color: '#220530',
        exercises: ['Bicep Curls', 'Push Ups']
      },
      Legs: {
        color: '#220530',
        exercises: ['Squats', 'Lunges', 'Leg Press']
      }
    };

    return (
      <PaperProvider>
        <View>
          <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
            <Text style={styles.text}>
              {selectedExercise || 'Select Exercise'}
            </Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdowncontent}>
              <ScrollView>
                {Object.entries(ExerciseData).map(([group, data]) => (
                  <List.Accordion
                    key={group}
                    title={group}
                    expanded={expandedGroup === group}
                    onPress={() => handlePress(group)}
                    style={{
                      backgroundColor: data.color,
                      
                    }}
                  >
                    {data.exercises.map((exercise) => (
                      <List.Item
                        key={exercise}
                        title={exercise}
                        onPress={() => {
                          setSelectedExercise(exercise);
                          setIsDropdownOpen(false);
                        }}
                      />
                    ))}
                  </List.Accordion>
                ))
                }
              </ScrollView>
            </View>
          )}
        </View>
      </PaperProvider>
    );
  };

  const PurpleButton = ( { text, onPress } ) => {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../assets/images/purple_button.png')}
            style={styles.image2}
            transition={0}
          />
          <Text style={styles.textbutton}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };




  return (
    <View style={styles.container}>
      
      <TopBorder/>

      <TitleInput value={workoutName} onChangeText={setWorkoutName}/>

      <View style={{ marginVertical: 50}}>
        <ColorSelector
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      </View>

      <DateInput/>

      <BackButton
        onPress={() => router.back()}
      />

      <View style={styles.exercisetext}>
        <Text style={styles.text}>
          Exercises
        </Text>
      </View>
      <ExerciseDropdown/>

      <View style={styles.settext}>
        <Text style={styles.text}>
          Sets
        </Text>
        <SetInput value={sets} onChangeText={setSets}/>
      </View>

      <View style={styles.reptext}>
        <Text style={styles.text}>
          Reps
        </Text>
        <RepInput value={reps} onChangeText={setReps}/>
      </View>

      <View style={styles.weightText}>
        <Text style={styles.text}>
          Weight
        </Text>
        <WeightInput value={weight} onChangeText={setWeight}/>
      </View>

      <Text style={styles.lbstext}>
          lbs
      </Text>

      <Notes value={notes} onChangeText={setNotes}/>


      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.savetext}>Save</Text>
      </TouchableOpacity>

      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#220428',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    fontSize: 24,
    position: 'fixed',
  },
  image: {
    height: 30,
    width: 30,
    backgroundColor: "#90EEBF",
    borderRadius: 10
  },
  image2: {
    height: 116,
    width: 300,
    bottom: 200
  },
  border: {
    position: 'absolute',
    height: 50,
    width: 450,
    backgroundColor: "#19021A",
    bottom: 864,  
  },
  touchable: {
    position: 'absolute',
    height: 30,
    width: 30,
    bottom: 820,
    left: 20,
  },
  TitleText: {
    height: 50,
    width: 300,
    bottom: 320,
    color: 'white',
    fontSize: 30,
    textDecorationLine: 'underline'
  },
  TextBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  textbutton: {
    fontSize: 40, 
    color: 'white', 
    fontWeight: 'bold',
    textShadowColor: "dark gray",
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 1,
    bottom: 295
  },
  exercisetext: {
    position: 'absolute',
    bottom: 660,
    right: 265
  },
  settext: {
    position: 'absolute',
    bottom: 660,
    right: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reptext: {
   position: 'absolute',
   bottom: 660,
   right: 70,
   alignItems: 'center',
   justifyContent: 'center'
  },
  smallTextBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    bottom: -45,
    right: 0,
    height: 40,
    width: 40,
    backgroundColor: '#220530',
    borderRadius: 10
  },
  smallText: {
    color: 'white',
    fontSize: 20,
    height: 40,
    width: 40,
    bottom: -2
  },
  dropdown: {
    position: 'absolute',
    width: 170,
    bottom: -300,
    right: 20,
    backgroundColor: '#220530',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  dropdowncontent: {
    position: 'absolute',
    backgroundColor: '#220428',
    bottom: -451,
    right: 20,
    width: 170,
    borderWidth: 2,
    borderColor: '#BD4FD3',
    borderRadius: 10,
    overflow: 'hidden'
  },
  date: {
    position: 'absolute',
    bottom: 720
  },
  colorDot: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 15,
    borderColor: 'white',
    bottom: 700,
    left: 165
  },
  saveButton: {
    backgroundColor: "#90EEBF",
    bottom: 50,
    height: 50,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savetext: {
    color: 'black',
    fontSize: 30,
    bottom: 2
  },
  WeightBox: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 40,
    width: 60,
    backgroundColor: '#220530',
    borderRadius: 10,
    bottom: -45,
    left: 5
  },
  weightText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 575,
    right: 100
  },
  lbstext: {
    color: 'white',
    fontSize: 24,
    position: 'fixed',
    bottom: 385,
    left: 130
  },
  textbox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#BD4FD3',
    height: 100,
    width: 300,
    backgroundColor: '#220530',
    borderRadius: 10,
    bottom: 150,
  },
  notestext: {
    color: 'white',
    fontSize: 18,
    height: 100,
    width: 298,
  }
  
});

export default LogWorkoutScreen;
