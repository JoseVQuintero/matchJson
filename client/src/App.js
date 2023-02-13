import React, { useRef, useState } from "react";
import "./App.css";

import apiClient from "./http-common";

import axios from "axios";

function App() {

  const get_sku = useRef(null);
  const get_country = useRef(null);
  
  const [getResultDataSku, setGetResultDataSku] = useState(null);
  const [getResultData, setGetResultData] = useState(null);
  const [getResult, setGetResult] = useState(null);

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

 async function getAllData() {
    try {
      const res = await apiClient.get("/api/getjson");

      const result = {
        status: res.status + "-" + res.statusText,
        headers: res.headers,
        data: res.data,
      };

      setGetResultData(result.data);
      setGetResult(fortmatResponse(result));
    } catch (err) {
      setGetResult(fortmatResponse(err.response?.data || err));
    }
  }

  async function getDataBySku() {
    try {
      const sku = get_sku.current.value;
      const country = get_country.current.value;
      const res = await apiClient.get(`/api/getskus?sku=${sku}&country=${country}`);

      const result = {
        status: res.status + "-" + res.statusText,
        headers: res.headers,
        data: res.data,
      };

      setGetResultDataSku(result.data);
      setGetResult(fortmatResponse(result));
    } catch (err) {
      setGetResult(fortmatResponse(err.response?.data || err));
    }
  }

  const clearGetOutput = async () => {
    const sku = get_sku.current.value;
    const country = get_country.current.value;
    setGetResult(null);
     try {
      const res = await apiClient.get(`/api/putcontent?sku=${sku}&load=clear&country=${country}`);

      const result = {
        status: res.status + "-" + res.statusText,
        headers: res.headers,
        data: res.data,
       };
       
      const newData = getResultData.filter((item)=>item!==sku);
      setGetResultData(newData);
      setGetResult(fortmatResponse(result));
      getDataBySku();
    } catch (err) {
      setGetResult(fortmatResponse(err.response?.data || err));
    }
  };

  const loadGetOutput = async () => {
    const sku = get_sku.current.value;
    const country = get_country.current.value;
    setGetResult(null);
     try {
      const res = await apiClient.get(`/api/putcontent?sku=${sku}&load=load&country=${country}`);

      const result = {
        status: res.status + "-" + res.statusText,
        headers: res.headers,
        data: res.data,
       };
       
      const newData = getResultData.filter((item)=>item!==sku);
      setGetResultData(newData);
      setGetResult(fortmatResponse(result));
      getDataBySku();
    } catch (err) {
      setGetResult(fortmatResponse(err.response?.data || err));
    }
  };

  return (
    <div id="app" className="container my-4">
      <h3>React Axios example</h3>

      <div className="card mt-4">
        <div className="card-header">React Axios GET</div>
        <div className="card-body">
          <div className="input-group input-group-sm">
            <select
              class="form-select form-select-sm"
              ref={get_country}
              aria-label=".form-select-sm example"
            >
              <option value="mx" selected>
                mx
              </option>
              <option value="co" selected>
                co
              </option>
            </select>
            <button className="btn btn-sm btn-primary" onClick={getAllData}>
              Get All
            </button>
            <select
              class="form-select form-select-sm"
              ref={get_sku}
              aria-label=".form-select-sm example"
            >
              <option selected>Open this select menu</option>
              {getResultData?.map((item) => {
                return <option value={item}>{item}</option>;
              })}
            </select>
            <div className="input-group-append">
              <button className="btn btn-sm btn-primary" onClick={getDataBySku}>
                Get Sku
              </button>
            </div>

            <button
              className="btn btn-sm btn-warning ml-2"
              onClick={clearGetOutput}
            >
              Clear
            </button>
            <button
              className="btn btn-sm btn-warning ml-2"
              onClick={loadGetOutput}
            >
              Load
            </button>
          </div>
          <div className="alert alert-secondary mt-2" role="alert">
            {getResultDataSku?.title}-{get_sku?.current?.value}
          </div>
          <div class="container text-center">
            <div class="row align-items-start">
              <div class="col">
                Internet
                <div
                  className="alert alert-secondary mt-2 pre-scrollable"
                  role="alert"
                >
                  {getResultDataSku?.image?.map((item) => {
                    return (
                      <img src={item} class="img-thumbnail" alt="..."></img>
                    );
                  })}
                </div>
              </div>
              <div class="col">
                Agency
                <div
                  className="alert alert-secondary mt-2 pre-scrollable"
                  role="alert"
                >
                  {getResultDataSku?.agency[0].images?.map((item) => {
                    return (
                      <img src={item} class="img-thumbnail" alt="..."></img>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div class="container text-center">
            <div class="row align-items-start">
              <div class="col">
                Internet                
                <div
                  className="alert alert-secondary mt-2 pre-scrollable"
                  role="alert"
                  dangerouslySetInnerHTML={{
                    __html: getResultDataSku?.html,
                  }}
                ></div>
              </div>
              <div class="col">
                Agency
                <div
                  className="alert alert-secondary mt-2 pre-scrollable"
                  role="alert"
                  dangerouslySetInnerHTML={{
                    __html: getResultDataSku?.agency[0].html,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="alert alert-secondary mt-2" role="alert">
            Model
            {getResultDataSku?.model}
          </div>
          {
            <div
              className="alert alert-secondary mt-2 pre-scrollable"
              role="alert"
            >
              <pre>{fortmatResponse(getResultDataSku?.json)}</pre>
            </div>
          }
          {getResult && (
            <div
              className="alert alert-secondary mt-2 pre-scrollable"
              role="alert"
            >
              <pre>{getResult}</pre>
            </div>
          )}
          {JSON.stringify(getResultData)}
        </div>
      </div>

    </div>
  );
}

export default App;
