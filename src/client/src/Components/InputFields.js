import { Button, Radio, Slider, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Container } from "../Store/Provider";
import { getMatchedResults } from "../Services/Autocomplete"; 
import { getFakePath } from "../Services/services"; 

export const InputFields = () => {
  const [value, setValue] = useState(1);
  const [inputValue, setInputValue] = useState(0);
  const [startValue, setStartValue] = useState();
  const [startData, setStartData] = useState([]);
  const [endValue, setEndValue] = useState();
  const [endData, setEndData] = useState([]);

  const container = Container.useContainer();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onChangeSlider = (newValue) => {
    setInputValue(newValue);
  };

  const handleStartSearch = async (newValue) => {
    if (newValue) {
        const results = await getMatchedResults(newValue);
        setStartData(results);
    } else {
      setStartData([]);
    }
  };
  const handleStartChange = (newValue) => {
    setStartValue(newValue);
  };

  const handleEndSearch = async (newValue) => {
    if (newValue) {
        const results = await getMatchedResults(newValue);
        setEndData(results);
    } else {
      setEndData([]);
    }
  };
  const handleEndChange = (newValue) => {
    setEndValue(newValue);
  };

  const handleStartSelect = (value) => {
    container.callStart(value);
  }

  const handleEndSelect = (value) => {
    container.callEnd(value);
  }

  const sendData = async(e) => {
    const path = await getFakePath(container.startCoordinate, container.endCoordinate, inputValue, value)
    container.callPath(path)
  } 

  return (
    <div>
      <div className="feature_block">
        <Select
          showSearch
          value={startValue}
          placeholder="Start"
          showArrow={false}
          filterOption={false}
          onSearch={handleStartSearch}
          onChange={handleStartChange}
          onSelect={handleStartSelect}
          className="input-field"
          notFoundContent={null}
          options={(startData || []).map((d) => ({
            value: d.x + "," + d.y,
            label: d.label,
          }))}
        />
         <Select
          showSearch
          value={endValue}
          placeholder="Destination"
          showArrow={false}
          filterOption={false}
          onSearch={handleEndSearch}
          onChange={handleEndChange}
          onSelect={handleEndSelect}
          className="input-field"
          notFoundContent={null}
          options={(endData || []).map((d) => ({
            value: d.x + "," + d.y,
            label: d.label,
          }))}
        />
      </div>
      <div className="feature_block">
        <Slider
          min={1}
          max={100}
          onChange={onChangeSlider}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
        <h4 className="field_text"> {inputValue} % Away from Shortest Path</h4>
      </div>
      <div className="feature_block">
        <Radio.Group onChange={onChange} value={value} className="radio_item">
          <Radio value={1}>Maximize Elevation</Radio>
          <Radio value={2}>Minimize Elevation</Radio>
          <Radio value={3}>No Elevation</Radio>
        </Radio.Group>
      </div>
      <Button type="primary" icon={<SearchOutlined />} onClick={sendData}>
        Search
      </Button>
    </div>
  );
};
