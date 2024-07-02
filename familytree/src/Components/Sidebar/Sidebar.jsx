import React from 'react';
import './Sidebar.css';
// import familyData from '../../assets/all_family_names.json';
// import peopleData from '../../assets/people.json'

const Sidebar = ({ isOpen, onSelectFamily, toggleSidebar, familyData, peopleData }) => {
    const handleFamilyClick = (family) => {
        console.log([peopleData.find(person => (person.fid === family.id && person.id === null))])
        onSelectFamily([peopleData.find(person => (person.fid === family.id && person.id === null))]);
    };



    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? '<<' : '>>'}
            </button>
            {isOpen && (
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <h2>Families</h2>
                    </div>
                    <ul className="family-list">
                        {familyData.map(family => (
                            <li key={family.id} onClick={() => handleFamilyClick(family)}>
                                {family.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;