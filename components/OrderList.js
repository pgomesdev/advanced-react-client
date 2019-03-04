import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { formatDistance } from 'date-fns'
import gql from 'graphql-tag'
import Link from 'next/link'
import styled from 'styled-components'
import formatMoney from '../lib/formatMoney'
import OrderItemStyles from './styles/OrderItemStyles'
import ErrorMessage from './ErrorMessage'

const ORDERS_QUERY = gql`
  query ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      charge
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`

class OrderList extends Component {
  render() {
    return (
      <Query query={ORDERS_QUERY}>
        {({ data: { orders }, error, loading }) => {
          if (error) return <ErrorMessage error={error} />
          if (loading) return <p>Loading...</p>

          return (
            <div>
              <h2>You have {orders.length} orders</h2>
              <OrderUl>
                {orders.map(order => (
                  <OrderItemStyles key={order.id}>
                    <Link
                      href={{
                        pathname: '/order',
                        query: { id: order.id },
                      }}
                    >
                      <a>
                        <div className='order-meta'>
                          <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                          <p>{order.items.length} Products</p>
                          {/* <p>{formatDistance(order.createdAt, new Date())}</p> */}
                          <p>{order.createdAt}</p>
                          <p>{formatMoney(order.total)}</p>
                          <div className='images'>
                            {order.items.map(item => (
                              <img key={item.id} src={item.image} alt={item.title} />
                            ))}
                          </div>
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </OrderUl>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default OrderList