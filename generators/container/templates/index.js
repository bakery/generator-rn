/*
 *
 * <%= helpers.properCase(containerName) %> 
 *
 */

import React, { Component, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

class <%= containerName %> extends Component {
  render() {
    return (
      <View>
        <Text><%= helpers.properCase(containerName) %></Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(<%= containerName %>);
