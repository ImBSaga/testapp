import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  FlatList,
  Linking,
  Modal,
  Alert,
} from 'react-native'

//UI testing
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../assets/colors/colors'
import Feather from 'react-native-vector-icons/Feather'
import categoriesData from '../assets/data/categoriesData'
import popularData from '../assets/data/popularData'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

//Dropdown Modal API
import axios from 'axios'
import { Dropdown } from 'react-native-element-dropdown'

Icon.loadFont()
Feather.loadFont()
MaterialCommunityIcons.loadFont()

const Template = ({ route, navigation }) => {
  //Modal
  const [countryData, setCountryData] = useState([])
  const [stateData, setStateData] = useState([])
  const [cityData, setCityData] = useState([])
  const [country, setCountry] = useState(null)
  const [state, setState] = useState(null)
  const [city, setCity] = useState(null)
  const [countryName, setCountryName] = useState(null)
  const [stateName, setStateName] = useState(null)
  const [cityName, setCityName] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    var config = {
      method: 'get',
      url: 'https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json',
    }

    axios(config)
      .then(function (response) {
        //Testing the api json data
        // console.log(JSON.stringify(response.data))
        var count = Object.keys(response.data).length
        let countryArray = []
        for (var i = 0; i < count; i++) {
          countryArray.push({
            value: response.data[i].id,
            label: response.data[i].name,
          })
        }
        setCountryData(countryArray)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])

  const handleState = (provinceId) => {
    var config = {
      method: 'get',
      url: `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`,
    }

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data))
        var count = Object.keys(response.data).length
        let stateArray = []
        for (var i = 0; i < count; i++) {
          stateArray.push({
            value: response.data[i].id,
            label: response.data[i].name,
          })
        }
        setStateData(stateArray)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const handleCity = (regencyId) => {
    var config = {
      method: 'get',
      url: `https://emsifa.github.io/api-wilayah-indonesia/api/districts/${regencyId}.json`,
    }

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data))
        var count = Object.keys(response.data).length
        let cityArray = []
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].province_id,
            label: response.data[i].name,
          })
        }
        setCityData(cityArray)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const [value, setValue] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  //News Stuff
  const [newsData, setNewsData] = useState([])
  const url =
    'https://newsapi.org/v2/everything?q=apple&from=2023-03-07&to=2023-03-07&sortBy=popularity&apiKey=816e53258c3d4ac6b25d879f009d8989'
  const getArticles = () => {
    fetch(url)
      .then((res) => res.json())
      .then((json) => setNewsData(json))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getArticles()
  }, [])

  //UI Testing
  const renderCategoryItem = ({ item }) => {
    return (
      <View
        style={[
          styles.categoryItemWrapper,
          {
            backgroundColor: item.selected ? colors.primary : colors.white,
            marginLeft: item.id == 1 ? 20 : 0,
          },
        ]}
      >
        <Image source={item.image} style={styles.categoryItemImage} />
        <Text style={styles.categoryItemTitle}>{item.title}</Text>
        <View
          style={[
            styles.categorySelectWrapper,
            {
              backgroundColor: item.selected ? colors.white : colors.secondary,
            },
          ]}
        >
          <Feather
            name="chevron-right"
            size={8}
            style={styles.categorySelectIcon}
            color={item.selected ? colors.black : colors.white}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={{ backgroundColor: '#fff', padding: 20, borderRadius: 15 }}
          >
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={countryData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Provinsi' : '...'}
              searchPlaceholder="Search..."
              value={country}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setCountry(item.value)
                handleState(item.value)
                setCountryName(item.label)
                setIsFocus(false)
              }}
            />
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={stateData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Kota' : '...'}
              searchPlaceholder="Search..."
              value={state}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setState(item.value)
                handleCity(item.value)
                setStateName(item.label)
                setIsFocus(false)
              }}
            />
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={cityData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Kecamatan' : '...'}
              searchPlaceholder="Search..."
              value={city}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setCity(item.value)
                setCityName(item.label)
                setIsFocus(false)
              }}
            />

            <TouchableOpacity
              style={{
                backgroundColor: '#0F3460',
                padding: 20,
                borderRadius: 15,
                alignItems: 'center',
              }}
              onPress={() => {
                Alert.alert(
                  `These are the inputs: ${countryName}, ${stateName}, ${cityName}`,
                )
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
              }}
            >
              <Text>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* UI Widget Testing */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SafeAreaView>
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Charts')
              }}
            >
              <Image
                source={require('../assets/images/profile.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <EvilIcons name="navicon" size={30} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Categories */}

        <View style={styles.categoriesWrapper}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <View style={styles.categoriesListWrapper}>
            <FlatList
              data={categoriesData}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal={true}
            />
          </View>
        </View>

        {/* Popular */}
        <View style={styles.popularWrapper}>
          <Text style={styles.popularTitle}>Popular</Text>
          {popularData.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigation.navigate('Details', {
                  item: item,
                })
              }
            >
              <View
                style={[
                  styles.popularCardWrapper,
                  {
                    marginTop: item.id == 1 ? 10 : 20,
                  },
                ]}
              >
                <View>
                  <View>
                    <View style={styles.popularTopWrapper}>
                      <MaterialCommunityIcons
                        name="crown"
                        size={12}
                        color={colors.primary}
                      />
                      <Text style={styles.popularTopText}>top of the week</Text>
                    </View>
                    <View style={styles.popularTitlesWrapper}>
                      <Text style={styles.popularTitlesTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.popularTitlesWeight}>
                        Weight {item.weight}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.popularCardBottom}>
                    <View style={styles.addPizzaButton}>
                      <Feather name="plus" size={10} color={colors.textDark} />
                    </View>
                    <View style={styles.ratingWrapper}>
                      <MaterialCommunityIcons
                        name="star"
                        size={10}
                        color={colors.textDark}
                      />
                      <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.popularCardRight}>
                  <Image source={item.image} style={styles.popularCardImage} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* News */}
        <View style={styles.categoriesWrapper}>
          <Text style={styles.categoriesTitle}>News</Text>
          {newsData.articles &&
            newsData.articles.map((article, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(article.url)}
              >
                <View
                  style={[
                    styles.popularCardWrapper,
                    {
                      marginTop: index == 1 ? 10 : 20,
                    },
                  ]}
                >
                  <View>
                    <View>
                      <View style={styles.popularTopWrapper}>
                        <MaterialCommunityIcons
                          name="crown"
                          size={12}
                          color={colors.primary}
                        />
                        <Text style={styles.popularTopText}>
                          Beaking News !
                        </Text>
                      </View>
                      <View style={styles.popularTitlesWrapper}>
                        <Text style={styles.popularTitlesTitle}>
                          {article.title}
                        </Text>
                        <Text style={styles.popularTitlesWeight}>
                          Address {article.author}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.popularCardBottom}>
                      <View style={styles.addPizzaButton}>
                        <Feather
                          name="plus"
                          size={10}
                          color={colors.textDark}
                        />
                      </View>
                      <View style={styles.ratingWrapper}>
                        <MaterialCommunityIcons
                          name="star"
                          size={10}
                          color={colors.textDark}
                        />
                        <Text style={styles.rating}>{article.publishedAt}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.popularCardRight}>
                    <Image
                      source={article.urlToImage}
                      style={styles.popularCardImage}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dropdownpicker: {
    marginLeft: 200,
    width: 150,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  categoriesWrapper: {
    marginTop: 30,
  },
  categoriesTitle: {
    fontSize: 16,
    paddingHorizontal: 20,
  },
  categoriesListWrapper: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  categoryItemWrapper: {
    backgroundColor: '#F5CA48',
    marginRight: 20,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  categoryItemImage: {
    width: 60,
    height: 60,
    marginTop: 25,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  categoryItemTitle: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  categorySelectWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 26,
    height: 26,
    borderRadius: 26,
    marginBottom: 20,
  },
  categorySelectIcon: {
    alignSelf: 'center',
  },
  popularWrapper: {
    paddingHorizontal: 20,
  },
  popularTitle: {
    fontSize: 16,
  },
  popularCardWrapper: {
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  popularTopWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularTopText: {
    marginLeft: 10,
    fontSize: 14,
  },
  popularTitlesWrapper: {
    marginTop: 20,
  },
  popularTitlesTitle: {
    fontSize: 14,
    color: colors.textDark,
  },
  popularTitlesWeight: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 5,
  },
  popularCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: -20,
  },
  addPizzaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  rating: {
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 5,
  },
  popularCardRight: {
    marginLeft: 40,
  },
  popularCardImage: {
    width: 210,
    height: 125,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#533483',
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },
  dropdown: {
    marginBottom: 10,
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})

export default Template
