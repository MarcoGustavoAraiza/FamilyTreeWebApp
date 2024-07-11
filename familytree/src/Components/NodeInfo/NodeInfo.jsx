import React, { useEffect, useState } from 'react';
import './NodeInfo.css';
// import peopleData from '../../assets/people.json'; // Assuming the JSON file is in this location

const NodeInfo = ({ hoveredNode, onMouseEnter, onMouseLeave, peopleData }) => {
    const [spouse, setSpouse] = useState([]);
    const [children, setChildren] = useState([]);
    const [parents, setParents] = useState({ father: null, mother: null });



    useEffect(() => {
        if (hoveredNode) {
            const spouseData = hoveredNode.spouse && hoveredNode.spouse.length > 0 
            ? hoveredNode.spouse.map(sp => {
                if (typeof sp === 'object') {
                    return sp;
                } else {
                    return peopleData.find(person => person.id === sp);
                }
                }).filter(sp => sp !== undefined)
                : [];
            setSpouse(spouseData);

            const childrenData = hoveredNode.children && hoveredNode.children.length > 0 
                ? hoveredNode.children.map(child => {
                    if (typeof child === 'object') {
                        return child;
                    } else {
                        return peopleData.find(person => person.id === child);
                    }
                }).filter(child => child !== undefined)
                : [];
            setChildren(childrenData);

            const fatherData = hoveredNode.father ? peopleData.find(person => person.id === hoveredNode.father) : null;
            const motherData = hoveredNode.mother ? peopleData.find(person => person.id === hoveredNode.mother) : null;
            setParents({ father: fatherData, mother: motherData });
        } else {
            setSpouse([]);
            setChildren([]);
            setParents({ father: null, mother: null });
        }
    }, [hoveredNode]);

    if (!hoveredNode) {
        return null;
    }

    const isMainFamiliaNode = hoveredNode && !hoveredNode.id && hoveredNode.children;

    return (
        <div className="node-info" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <h3>{hoveredNode.name} {hoveredNode.lastname}</h3>

            {hoveredNode.image && (
                <div className="node-info__image">
                    <img src={hoveredNode.image} alt={`${hoveredNode.image_note}`} />
                </div>
            )}

            {isMainFamiliaNode ? (
                <>
                    <p>Oldest Members:</p>
                    {children.length > 0 ? (
                        <ul>
                            {children.map(child => (
                                <li key={child.id}>{child.name} {child.lastname}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No children</p>
                    )}
                </>
            ) : (
                <>
                    <p>Birthdate: {hoveredNode.birthdate || 'N/A'}</p>
                    <p>Birthplace: {hoveredNode.birthplace || 'N/A'}</p>
                    <p>Deathdate: {hoveredNode.death_date || 'N/A'}</p>
                    <p>Deathplace: {hoveredNode.death_place || 'N/A'}</p>
                    <p>Sex: {hoveredNode.sex || 'N/A'}</p>
                
                    {spouse.length > 0 ? (
                        <div>
                            <p>Spouse:</p>
                            <ul>
                                {spouse.map(sp => (
                                    <li key={sp.id}>{sp.name} {sp.lastname}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Spouse: N/A</p>
                    )}
                    
                    {children.length > 0 ? (
                        <div>
                            <p>Children:</p>
                            <ul>
                                {children.map(child => (
                                    <li key={child.id}>{child.name} {child.lastname}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Children: N/A</p>
                    )}
                    <p>Parents:</p>
                    <ul>
                        {parents.father ? <li>Father: {parents.father.name} {parents.father.lastname}</li> : <li>Father: N/A</li>}
                        {parents.mother ? <li>Mother: {parents.mother.name} {parents.mother.lastname}</li> : <li>Mother: N/A</li>}
                    </ul>
                    <p>Additional Info: {hoveredNode.info || 'N/A'}</p>
                </>
            )}
        </div>
    );
};

export default NodeInfo;
