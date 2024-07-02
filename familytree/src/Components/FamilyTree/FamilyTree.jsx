import React, { useState, useEffect } from 'react';
import './FamilyTree.css';
import treeData from '../../assets/all_families.json';
import peopleData from '../../assets/people.json';

const FamilyTree = ({ selectedFamilies, onNodeHover, onNodeLeave, onSelectFamily }) => {
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [familyTree, setFamilyTree] = useState([]);
    const [nodeSwitch, setNodeSwitch] = useState(null);


    let clickTimeout = null;


    const getParentNode = (node) => {
        let current = null;
        if (node && node.father) {
            const parent = peopleData.find(person => person.id === node.father);
            if (parent) {
                current = parent;
            }
        }
        return current;
    };

    const getAllDescendantPaths = (node, path) => {
        let paths = [];
        const traverse = (node, path) => {
            if (node.children && node.children.length > 0) {
                const childrenData = node.children.map(child => {
                    if (typeof child === 'object') {
                        return child;
                    } else {
                        return peopleData.find(person => person.id === child);
                    }
                    });
                
                console.log(node.children)  
                childrenData.forEach((child, index) => {
                    const newPath = `${path}-${child.id}`;
                    paths.push(newPath);
                    traverse(child, newPath);
                });
            }
        };

        traverse(node, path);
        return paths;
    };


    const expandParent = (parent, node) => {
        console.log(node)
        console.log(parent)
        if (parent) {
            console.log(selectedFamilies)
            let updatedSelectedFamilies = selectedFamilies.concat(parent);
            console.log(updatedSelectedFamilies)
            updatedSelectedFamilies = updatedSelectedFamilies.filter(n => n.fid !== node.fid || n.id !== node.id);
            console.log(updatedSelectedFamilies)
            onSelectFamily(updatedSelectedFamilies);
        }
    };

    const handleNodeClick = (path, node) => {
        
        const parent = getParentNode(node);
        const pid = parent ? (parent.id !== null ? `-${parent.id}` : `-${parent.fid}`) : '';
        const childPath = `${pid}${path}`;
        const parentPath = parent ? `${pid}` : '';
        const parentFlag = expandedNodes.includes(path) ? false : true;


        if (!clickTimeout) {
            clickTimeout = setTimeout(() => {
                console.log(expandedNodes)
                setExpandedNodes(prevExpandedNodes =>
                    prevExpandedNodes.includes(path)
                        ? prevExpandedNodes.filter(item => item !== path)
                        : [...prevExpandedNodes, childPath, parentPath]
                );
                if (parentFlag) {
                    expandParent(parent, node)
                }
                clickTimeout = null;
            }, 200);
        } else {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            handleNodeDoubleClick(path, node);
        }
    };

    const handleSpouseClick = (path, spouse, node) => {
        if (!clickTimeout) {
            clickTimeout = setTimeout(() => {
                let updatedSelectedFamilies = selectedFamilies.concat(spouse);
                updatedSelectedFamilies = updatedSelectedFamilies.filter(n => n.fid !== node.fid && n.id !== null);
                onSelectFamily(updatedSelectedFamilies);
                setExpandedNodes([path]);
                clickTimeout = null;
            }, 200);
        } else {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            handleNodeDoubleClick(path, node);
        }
    };

    const handleNodeDoubleClick = (path, node) => {
        setExpandedNodes(prevExpandedNodes => {
            if (prevExpandedNodes.includes(path)) {
                return prevExpandedNodes.filter(item => !item.startsWith(path));
            } else {
                const descendantPaths = getAllDescendantPaths(node, path);
                return [...prevExpandedNodes, path, ...descendantPaths];
            }
        });
    };

    const renderSpouse = (spouseId, node) => {
        const path = `-${spouseId}`;
        const spouse = peopleData.find(person => person.id === spouseId);
        if (!spouse) return null;
        return (
            <div
                key={spouse.id}
                onClick={() => handleSpouseClick(path, spouse, node)}
                className="spouse-node"
                onMouseEnter={() => onNodeHover(spouse)}
                onMouseLeave={onNodeLeave}
                style={{ userSelect: 'none' }}
            >
                {spouse.name} {spouse.lastname}
            </div>
        );
    };

    const renderNode = (node, parentIndex, index) => {
        if (nodeSwitch) {
            node = nodeSwitch
            setNodeSwitch(null)
        }

        const path = `${parentIndex}-${index}`;
        console.log(expandedNodes)

        const isExpanded = expandedNodes.includes(path);
        const hasChildren = node.children && node.children.length > 0;
        const hasSpouse = node.spouse && node.spouse.length > 0;
        const childrenData = hasChildren ? node.children.map(child => {
            if (typeof child === 'object') {
                return child;
            } else {
                return peopleData.find(person => person.id === child);
            }
            }).filter(child => child !== undefined)
            : [];
        
        console.log("Selected Families", selectedFamilies)
        console.log(isExpanded)

        return (
            <li
                key={path}
                className={`person ${isExpanded ? 'expanded' : ''} ${hasChildren ? 'has-children' : ''}`}
            >
            {hasSpouse && isExpanded ?
                (<div className="node-spouse-container">
                    <div
                        onClick={() => handleNodeClick(path, node)}
                        className={`innernode ${hasChildren ? 'has-children' : ''}`}
                        onMouseEnter={() => onNodeHover(node)}
                        onMouseLeave={onNodeLeave}
                        style={{ userSelect: 'none' }}
                    >
                        {node.name} {node.lastname}
                    </div>
                        {node.spouse.map((spouse) => renderSpouse(spouse, node))}
                </div>
            ) : (
                <div className="node-container">
                    <div
                        onClick={() => handleNodeClick(path, node)}
                        className={`innernode ${hasChildren ? 'has-children' : ''}`}
                        onMouseEnter={() => onNodeHover(node)}
                        onMouseLeave={onNodeLeave}
                        style={{ userSelect: 'none' }}
                    >
                        {node.name} {node.lastname}
                    </div>
                </div>
            ) }
                
                {isExpanded && hasChildren && (
                    <ul className="node">
                        {childrenData.map((child, childIndex) => renderNode(child, path, child.id))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="tree">
            <ul className="node">
                {selectedFamilies.map((node, index) =>
                    node.id === null ?
                    renderNode(node, '', node.fid) : renderNode(node, '', node.id)
                )}
            </ul>
        </div>
    );
};

export default FamilyTree;