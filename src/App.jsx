import React, { useState } from 'react';
import './App.scss';
import classnames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(({ id }) => (
    product.categoryId === id
  ));
  const user = usersFromServer.find(({ id }) => category.ownerId === id); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});
const SHOW_ALL_PRODUCTS = '';

function filterProductsByUser(grouppedProducts, selectedUserId) {
  if (selectedUserId === SHOW_ALL_PRODUCTS) {
    return products;
  }

  return grouppedProducts.filter(product => (
    product.user.id === selectedUserId
  ));
}

function searchProducts(grouppedProducts, selectedUserId, searchedName) {
  const filteredProducts = filterProductsByUser(grouppedProducts,
    selectedUserId);

  if (searchedName === SHOW_ALL_PRODUCTS) {
    return products;
  }

  return filteredProducts.filter(product => (
    product.name.toLowerCase().includes(searchedName.toLowerCase())
  ));
}

function filterProducts(
  grouppedProducts,
  selectedUserId,
  searchedName,
) {
  const filteredProducts = searchProducts(grouppedProducts,
    selectedUserId,
    searchedName);

  return filteredProducts;
}

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(SHOW_ALL_PRODUCTS);
  const [searchedName, setSearchedName] = useState(SHOW_ALL_PRODUCTS);
  const filteredProducts = filterProducts(products,
    selectedUserId, searchedName);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classnames({
                  'is-active': selectedUserId === SHOW_ALL_PRODUCTS,
                })}
                onClick={() => {
                  setSearchedName(SHOW_ALL_PRODUCTS);
                  setSelectedUserId(SHOW_ALL_PRODUCTS);
                }}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classnames({
                    'is-active': selectedUserId === user.id,
                  })}
                  onClick={() => setSelectedUserId(user.id)}
                  key={user.id}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchedName}
                  onChange={event => setSearchedName(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchedName !== SHOW_ALL_PRODUCTS && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => (setSearchedName(SHOW_ALL_PRODUCTS))
                      }
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                  key={category.id}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSearchedName(SHOW_ALL_PRODUCTS);
                  setSelectedUserId(SHOW_ALL_PRODUCTS);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filteredProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr
                    data-cy="Product"
                    key={product.id}
                  >
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={classnames({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )

          }
        </div>
      </div>
    </div>
  );
};
