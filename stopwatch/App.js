import React, {useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

const App = () => {
  const [time, setTime] = useState(0);
  const [lap, setLaps] = useState([]);
  const [running, setRunning] = useState(false);
  const [lapdifference, setLapDifference] = useState([
    {changeLap: 0, timeShown: 0},
  ]);
  const intervalRef = useRef(null);

  const startStopwatch = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setTime(count => count + 1000);
      }, 1000);
    }
    setLaps([]);
    setLapDifference([]);
  };
  const calculateDifferenceOfLaps = lap => {
    return lap.slice(1).map((lapTime, index) => ({
      changeLap: index === 0 ? lapTime : Math.abs(lapTime - lap[index]),
      timeShown: lapTime,
    }));
  };
  const pasuse = () => {
    clearInterval(intervalRef.current);
    //setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setLaps([]);
    setLapDifference([]);
    setRunning(false);
  };

  const lapFun = () => {
    setLaps(prevLaps => [...prevLaps, time]);
    setLapDifference(calculateDifferenceOfLaps([...lap, time]));
  };

  const formatedTime = time => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    // const milliseconds = Math.floor((time % 1000) / 10);
    return `${padTime(minutes)}:${padTime(seconds)}`;
  };
  const padTime = time => {
    return time.toString().padStart(2, '0');
  };
  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <Text style={styles.watch}>{formatedTime(time)}</Text>

      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <TouchableOpacity
          activeOpacity={0.1}
          style={styles.startBtn}
          onPress={() => startStopwatch()}>
          <Text style={styles.btnTxt}>{'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.1}
          style={styles.startBtn}
          onPress={reset}>
          <Text style={styles.btnTxt}>{'reset'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.1}
          style={styles.startBtn}
          onPress={() => pasuse()}>
          <Text style={styles.btnTxt}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.startBtn}
          onPress={() => lapFun()}>
          <Text style={styles.btnTxt}>Lap</Text>
        </TouchableOpacity>
      </View>
      {running ? (
        <FlatList
          data={lapdifference}
          renderItem={({item, index}) => {
            return (
              <ScrollView
                contentContainerStyle={{
                  justifyContent: 'space-evenly',
                  flexDirection: 'row',
                  marginBottom: 5,
                }}>
                <Text>{index + 1}</Text>
                <Text style={{color: 'black', textAlign: 'center'}}>
                  +{formatedTime(item.changeLap)}
                </Text>
                <Text>{'------>'}</Text>
                <Text style={{color: 'black', textAlign: 'center'}}>
                  {formatedTime(item.timeShown)}
                </Text>
              </ScrollView>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  startBtn: {
    width: '20%',
    height: '15%',
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  watch: {
    color: 'red',
    fontSize: 40,
    alignSelf: 'center',
    marginTop: 50,
  },
  btnTxt: {
    color: 'red',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default App;
