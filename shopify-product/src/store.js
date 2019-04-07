import Store, { thunk } from 'repatch';
import produce from 'immer';

const initialState = {
  query: null,
  products: {},
  searches: {},
};

const store = new Store(initialState).addMiddleware(thunk);
const act = producer => state => produce(state, producer);

/* eslint-disable no-param-reassign */

export const fetchProductById = (id, client) => () => (dispatch) => {
  dispatch(act((state) => {
    state.products[id] = state.products[id] || { result: null };
    state.products[id].status = 'loading';
  }));

  return client.productById(id)
    .then((product) => {
      dispatch(act((state) => {
        state.products[id].result = product;
        state.products[id].status = 'success';
      }));
    });
};

export const fetchProductsMatching = (query, client) => () => (dispatch) => {
  dispatch(act((state) => {
    state.searches[query] = state.searches[query] || { result: [] };
    state.searches[query].status = 'loading';
    state.query = query;
  }));

  return client.productsMatching(query)
    .then((products) => {
      dispatch(act((state) => {
        state.searches[query].status = 'success';
        state.searches[query].result = products.map(p => p.id);
        products.forEach((product) => {
          state.products[product.id] = state.products[product.id] || {};
          state.products[product.id].result = product;
        });
      }));
    });
};

export default store;
