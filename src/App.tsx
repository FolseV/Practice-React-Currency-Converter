import { useState, useEffect, SetStateAction, useRef } from "react";
import { Block } from "./Block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("RUB");
  const [fromPrice, setFromPrice] = useState(1);
  const [toPrice, setToPrice] = useState(0);
  const ratesRef = useRef<any>({});

  useEffect(() => {
    fetch("https://api.nbrb.by/exrates/rates?periodicity=0")
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = Object.fromEntries(
          json.map((obj: any) => {
            let curAbrr = obj.Cur_Abbreviation;
            let curRate = obj.Cur_OfficialRate * obj.Cur_Scale;
            return [curAbrr, curRate];
          })
        );
        onChangeFromPrice(fromPrice);
      })
      .catch((err) => {
        console.warn(err);
        alert("No data from server");
      });
  }, []);

  const onChangeFromPrice = (value: SetStateAction<number>) => {
    const price = +value / ratesRef.current[fromCurrency];
    const result = (price * ratesRef.current[toCurrency]).toFixed(3);
    setToPrice(+result);
    setFromPrice(value);
  };

  const onChangeToPrice = (value: SetStateAction<number>) => {
    const price = +value / ratesRef.current[toCurrency];
    const result = (price * ratesRef.current[fromCurrency]).toFixed(3);
    setFromPrice(+result);
    setToPrice(value);
  };

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);
  useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block value={fromPrice} currency={fromCurrency} onChangeValue={onChangeFromPrice} onChangeCurrency={setFromCurrency} />

      <Block value={toPrice} currency={toCurrency} onChangeValue={onChangeToPrice} onChangeCurrency={setToCurrency} />
    </div>
  );
}

export default App;
