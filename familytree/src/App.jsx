import React, { useEffect, useState } from 'react';
import FamilyGraph from './Components/FamilyGraph/FamilyGraph';
import TopMenuBar from './Components/TopMenuBar/TopMenuBar';
import NodeInfo from './Components/NodeInfo/NodeInfo';
import Sidebar from './Components/Sidebar/Sidebar';
import { fetchAllFamilyNames, fetchPeople } from './api';
import './index.css';

const App = () => {
    const [selectedFamilies, setSelectedFamilies] = useState([]);
    const [hoveredNode, setHoveredNode] = useState(null); // State to track the currently hovered node
    const [isInfoHovered, setIsInfoHovered] = useState(false); // State to track if the NodeInfo is hovered
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track sidebar visibility
    const [sidebarFamily, setSidebarFamily] = useState(null)
    const [familyData, setFamilyData] = useState([]);
    const [peopleData, setPeopleData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedFamilyData = await fetchAllFamilyNames();
            const fetchedPeopleData = await fetchPeople();
            setFamilyData(fetchedFamilyData);
            setPeopleData(fetchedPeopleData);
        };

        fetchData();
    }, []);


    const handleSelectFamily = (families) => {
        setSelectedFamilies(families);
        setSidebarFamily(null)
    };

    const handleSidebarFamily = (family) => {
        setSidebarFamily(family)
        setSelectedFamilies([])
    }

    const handleNodeHover = (node) => {
        setHoveredNode(node);
    };

    const handleMouseLeave = () => {
        if (!isInfoHovered) {
            setHoveredNode(null);
        }
    };

    const handleInfoMouseEnter = () => {
        setIsInfoHovered(true);
    };

    const handleInfoMouseLeave = () => {
        setIsInfoHovered(false);
        setHoveredNode(null);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="App">
            <Sidebar
                isOpen={isSidebarOpen}
                onSelectFamily={handleSidebarFamily}
                toggleSidebar={toggleSidebar}
                familyData={familyData}
                peopleData={peopleData}
            />
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <TopMenuBar 
                    onSelectFamily={handleSelectFamily} 
                    selectedFamilies={selectedFamilies}
                    familyData={familyData}
                    peopleData={peopleData}
                />
                <div className="zoom-container">
                    <FamilyGraph 
                        selectedFamilies={selectedFamilies}
                        onNodeHover={handleNodeHover}
                        onNodeLeave={handleMouseLeave}
                        sidebarFamily={sidebarFamily}
                        peopleData={peopleData}
                    />
                </div>
                <NodeInfo
                    hoveredNode={hoveredNode}
                    onMouseEnter={handleInfoMouseEnter}
                    onMouseLeave={handleInfoMouseLeave}
                    peopleData={peopleData}
                />
            </div>
        </div>
    );
};

export default App;