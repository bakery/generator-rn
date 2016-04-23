/*
 *
 * <%= helpers.properCase(containerName) %>
 *
 */

import React, { Component, View, Text } from 'react-native';
import { connect } from 'react-redux';
<% if (selectorName) { %>
import { createSelector } from 'reselect';
import { <%= selectorName %>Selector } from '../selectors/<%= selectorName %>';
<% } %>

class <%= containerName %> extends Component {
  render() {
    return (
      <View>
        <Text><%= helpers.properCase(containerName) %></Text>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

<% if (selectorName) { %>
export default connect(createSelector([<%= selectorName %>Selector],
  (<%= selectorName %>) => ({ })
), mapDispatchToProps)(<%= containerName %>);

<% } else { %>
function mapStateToProps(state) {
  return {}; 
}

export default connect(mapStateToProps, mapDispatchToProps)(<%= containerName %>);
<% } %>
