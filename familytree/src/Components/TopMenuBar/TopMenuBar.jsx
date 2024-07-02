import React from 'react';
import Select from 'react-select';
import './TopMenuBar.css';
// import familyData from '../../assets/all_family_names.json';
// import peopleData from '../../assets/people.json';

const TopMenuBar = ({ onSelectFamily, selectedFamilies, familyData, peopleData }) => {
  const options = familyData.map(family => ({ label: family.name, value: family.id }));


  // const selectedOptions = options.filter(option => selectedFamilies.includes(option.value));
  const selectedOptions = options.filter(option =>
    selectedFamilies.some(node => node.fid === option.value && node.id === null)
  );

  const handleChange = (selectedOptions) => {
    console.log(selectedOptions.map(option => (peopleData.find(person => (person.fid === option.value && person.id === null)))))
    onSelectFamily(selectedOptions.map(option => (peopleData.find(person => (person.fid === option.value && person.id === null)))));
  };

  return (
    <div className="top-menu-bar">
      <h1>Californio Family Tree</h1>
      <Select
        isMulti
        value={selectedOptions}
        options={options}
        onChange={handleChange}
        className="family-select"
        placeholder="Select Families"
        closeMenuOnSelect={false}
      />
    </div>
  );
};

export default TopMenuBar;
