import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { CURRENT_USER_QUERY } from './User'

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={this.props}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(removeFromCart, { loading }) => (
          <BigButton
            title='Delete Item'
            onClick={() => {
              removeFromCart().catch(err => alert(err.message))
            }}
            disabled={loading}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}

export default RemoveFromCart
