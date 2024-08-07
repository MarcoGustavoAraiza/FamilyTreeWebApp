import React, { useEffect, useState } from 'react';
import './NodeInfo.css';

const NodeInfo = ({ hoveredNode, peopleData }) => {
    const [spouse, setSpouse] = useState([]);
    const [children, setChildren] = useState([]);
    const [parents, setParents] = useState({ father: null, mother: null });
    const [isHovered, setIsHovered] = useState(false);
    const [activeNode, setActiveNode] = useState(null);

    useEffect(() => {
        if (hoveredNode) {
            setActiveNode(hoveredNode);
        }
    }, [hoveredNode]);

    useEffect(() => {
        if (activeNode) {
            const spouseData = activeNode.spouse && activeNode.spouse.length > 0 
                ? activeNode.spouse.map(sp => {
                    if (typeof sp === 'object') {
                        return sp;
                    } else {
                        return peopleData.find(person => person.id === sp);
                    }
                }).filter(sp => sp !== undefined)
                : [];
            setSpouse(spouseData);

            const childrenData = activeNode.children && activeNode.children.length > 0 
                ? activeNode.children.map(child => {
                    if (typeof child === 'object') {
                        return child;
                    } else {
                        return peopleData.find(person => person.id === child);
                    }
                }).filter(child => child !== undefined)
                : [];
            setChildren(childrenData);

            const fatherData = activeNode.father ? peopleData.find(person => person.id === activeNode.father) : null;
            const motherData = activeNode.mother ? peopleData.find(person => person.id === activeNode.mother) : null;
            setParents({ father: fatherData, mother: motherData });
        } else {
            setSpouse([]);
            setChildren([]);
            setParents({ father: null, mother: null });
        }
    }, [activeNode]);

    if (!activeNode && !isHovered) {
        return null;
    }

    const handleClose = () => {
        setActiveNode(null);
    };

    return (
        <div className="node-info">
            <button onClick={handleClose} className="node-info__close-button">X</button>
            <div className="node-info__content">
                {activeNode && (
                    <>
                        <h3>{activeNode.name} {activeNode.lastname}</h3>

                        {activeNode.image && (
                            <div className="node-info__image-container">
                                <img src={activeNode.image} alt={`${activeNode.name} ${activeNode.lastname}`} className="node-info__image" />
                                {activeNode.imageAttribution && (
                                    <p className="node-info__image-attribution">{activeNode.imageAttribution}</p>
                                )}
                            </div>
                        )}

                        <p>Birthdate: {activeNode.birthdate || 'N/A'}</p>
                        <p>Birthplace: {activeNode.birthplace || 'N/A'}</p>
                        <p>Deathdate: {activeNode.death_date || 'N/A'}</p>
                        <p>Deathplace: {activeNode.death_place || 'N/A'}</p>
                        <p>Sex: {activeNode.sex || 'N/A'}</p>
                    
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
                        <p>Additional Info: {activeNode.info || 'N/A'}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default NodeInfo;
