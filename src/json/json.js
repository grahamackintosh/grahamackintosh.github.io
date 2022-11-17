import React, { useState } from 'react';
import './json.css'

function JsonPage() {
  const [jsonString, setJsonString] = useState('');
  const [jsonObject, setJsonObject] = useState({});
  const [referenceString, setReferenceString] = useState('');
  const [propertyString, setPropertyString] = useState('');
  const [property, setProperty] = useState({});
  const [availableKeys, setAvailableKeys] = useState([]);

  function handleObjectInputChange(event) {
    setJsonString(event.target.value);
    try {
      const parsedObject = JSON.parse(event.target.value);
      const fullReferenceString = 'objOverride.' + referenceString
      setJsonObject(parsedObject);
      getFirstProperty(fullReferenceString, 0, fullReferenceString, parsedObject);
    } catch {
      setJsonObject({});
      setPropertyString('');
      setAvailableKeys([]);
    }
  }
  

  function updatePropertyKeys(property, unresolvedKey = null) {
    try {
      if (typeof property === 'object' && !Array.isArray(property) && property !== null) {
        let types = Object.entries(property).map(([k, v]) => ([k, getTypeName(v)]));
        if (unresolvedKey != null) {
          types = types.filter(([k, v]) => k.toLowerCase().includes(unresolvedKey.toLowerCase()))
        }
        setAvailableKeys(types);
      } else if (Array.isArray(property)) {
        let combinedTypes = {}
        for (let i = 0; i < property.length; i++ ) {
          if (typeof property[i] != 'object') {
            continue;
          }
          let types = Object.entries(property[i]).map(([k, v]) => ([k, getTypeName(v)]));
          types.forEach(([k, v]) => {
            if (Array.isArray(combinedTypes[k])) {
              combinedTypes[k].push(v);
            } else {
              combinedTypes[k] = [v]
            }
          });
        }
        combinedTypes = Object.entries(combinedTypes).map(([k, v]) => [k, [... new Set(v)].sort().join(' | ')])
        setAvailableKeys(combinedTypes);
      } else {
        setAvailableKeys([]);
      }
    } catch {
      setAvailableKeys([])
    }
  }

  function handleReferenceInputChange(event) {
    setReferenceString(event.target.value);
    const fullReferenceString = 'jsonObject.' + event.target.value
    getFirstProperty(fullReferenceString, 0, fullReferenceString);
  }

  function getFirstProperty(referenceString, badSuffixLength, fullReferenceString, objOverride = null) {
    if (referenceString === '') {
      return;
    }
    try {
      let property = eval(referenceString);
      if (typeof property === 'function') {
        return
      }
      if (property === undefined) {
        throw Error;
      }
      if (typeof property === 'string' || property instanceof String) {
        const badSuffix = fullReferenceString.slice(-badSuffixLength)
        setPropertyString('"' + property + '"');
        setProperty(property);
        updatePropertyKeys(property, badSuffixLength === 0 ? null : badSuffix);
      } else {
        const badSuffix = fullReferenceString.slice(-badSuffixLength).slice(1)
        if (badSuffixLength > 0) {
          let filteredObject = {};
          Object.keys(property)
            .filter((key) => key.toLowerCase().includes(badSuffix.toLowerCase()))
            .forEach((key) => filteredObject[key] = property[key]);
          property = filteredObject
        }
        setPropertyString(JSON.stringify(property, null, 4));
        setProperty(property);
        updatePropertyKeys(property, badSuffixLength === 0 ? null : badSuffix);
      }
    } catch {
      const newBadSuffixLength = badSuffixLength + 1
      getFirstProperty(referenceString.slice(0, -1), newBadSuffixLength, fullReferenceString, objOverride);
    }
  }

  function getTypeName(object) { // needed because JS considers the 'typeof' for an Array as 'object'
    const type = typeof object
    if (Array.isArray(object)) {
      return 'list'
    } else if (object === null) {
      return 'null'
    } else if (type == 'string') {
      if(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(object)) {
        return 'string (uuid-like)'
      } else {
        return 'string'
      }
    } else {
      return type
    }
  }

  function styliseJSON(input) {
    input = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    function match_func(match) {
      let element_class
      if (/^"/.test(match)) {
        if (!(/:$/.test(match))) {
          element_class = 'json-prop-string';
        } else {
          element_class = 'json-key';
        }
      } else if (/true|false/.test(match)) {
        element_class = 'json-prop-boolean';
      } else if (/null/.test(match)) {
        element_class = 'json-prop-null';
      } else {
        element_class = 'json-prop-number'
      }
      return '<span class="' + element_class + '">' + match + '</span>';
    }
    let result
    result = input.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match_func);
    return result
  }

  return (
    <div>
      <textarea className="textinput" id="jsoninput" value={jsonString} onChange={handleObjectInputChange} spellCheck="false" />
      <input type="text" className="textinput" id="referenceinput" value={referenceString} onChange={handleReferenceInputChange} spellCheck="false" />
      <div id="jsonoutput">
        <pre dangerouslySetInnerHTML={{__html: styliseJSON(propertyString)}}></pre>
        <ul id="keyslist" style={{ "width": "50%" }}>
          {availableKeys.map(([key, type]) => (<li>{key} ({type})</li>))}
        </ul>
      </div>
    </div>
  );
}

export default JsonPage;
