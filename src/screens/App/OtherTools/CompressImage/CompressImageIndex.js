import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import ImageResizer from './ImageResizer';
import ImageCompressor from './ImageCompressor';

const CompressImageIndex = () => {
  return (
    <View style={{flex:1}}>
      <ImageCompressor />
      {/* <ImageResizer /> */}
    </View>
  )
}

export default CompressImageIndex

const styles = StyleSheet.create({})