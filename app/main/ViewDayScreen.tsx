import { useLocalSearchParams, useRouter } from "expo-router";
import moment from 'moment';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';



const ViewDayScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    const selectedDate = params.selectedDate;
    const workoutColor = params.workoutColor;
    const notes = params.notes;

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

    return (
        <View style={styles.container}>

        <TopBorder/>

        <BackButton
            onPress={() => router.back()}
        />

        <DateInput/>

        <Text style={styles.text}>
          {(notes)}
        </Text>

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
  date: {
    position: 'absolute',
    bottom: 800
  },
  text: {
    color: 'white',
    fontSize: 24,
    position: 'fixed',
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
  image: {
    height: 30,
    width: 30,
    backgroundColor: "#90EEBF",
    borderRadius: 10
  },
});

export default ViewDayScreen;