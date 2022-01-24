import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

let qrcodes = [];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    setLoading(true);
    let response = await fetch('https://api.imgflip.com/get_memes');
    let json = await response.json();
    setData(data.concat(json.data.memes.slice(0, 30)));
    setLoading(false);
  };

  const onScroll = ev => {
    if (
      ev.contentOffset.y >=
        ev.contentSize.height - ev.layoutMeasurement.height - 20 &&
      !loading
    ) {
      fetchAPI();
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Project</Text>
      {loading ? (
        <Text style={[styles.description, {color: '#f00'}]}>Loading</Text>
      ) : (
        <Text style={styles.description}>Total counts: {data.length}</Text>
      )}
      <ScrollView
        style={{padding: 24}}
        onScroll={({nativeEvent}) => onScroll(nativeEvent)}>
        {data &&
          data.map((item, index) => {
            return (
              <View style={styles.row} key={index}>
                <Text style={[styles.text, {flex: 0.7}]}>{item.name}</Text>
                <Text style={styles.text}>{item.box_count}</Text>
                <Image source={{uri: item.url}} style={styles.photo} />
                {qrcodes.findIndex(e => e.url === item.url) > -1 ? (
                  <Image
                    source={{
                      uri: qrcodes[qrcodes.findIndex(e => e.url === item.url)]
                        .code,
                    }}
                    style={styles.photo}
                  />
                ) : (
                  <QRCode
                    getRef={ref => (qrcode = ref)}
                    value={item.url}
                    size={40}
                    color="black"
                    backgroundColor="white"
                    getRef={c => {
                      if (c) {
                        c.toDataURL(dataURL => {
                          qrcodes.push({
                            url: item.url,
                            code: `data:image/png;base64,${dataURL}`,
                          });
                        });
                      }
                    }}
                  />
                )}
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#666',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  photo: {
    width: 40,
    height: 40,
  },
});
