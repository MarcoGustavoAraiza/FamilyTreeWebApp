import React, { useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import './FamilyGraph.css';

// import peopleData from '../../assets/people.json';

const FamilyGraph = ({ selectedFamilies, onNodeHover, onNodeLeave, sidebarFamily, peopleData }) => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [renderedNodes, setRenderedNodes] = useState(new Set());
    const [clickedNodes, setClickedNodes] = useState([]);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [usingSidebar, setUsingSidebar] = useState(false);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    let clickTimeout = null;

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleNodeHover = node => {
        setHoveredNode(node);
        const person = node ? node.type === 'person' ? peopleData.find(person => person.id === node.id) :
            peopleData.find(person => person.fid == (node.id.replace('-', '')) && person.id === null) : null;
        onNodeHover(person);
    };

    const handleNodeLeave = () => {
        setHoveredNode(null);
        onNodeLeave();
    };

    useEffect(() => {
        let families = null;
        if (selectedFamilies) {
            families = selectedFamilies.map(n => n);
        }

        if (sidebarFamily) {
            families = sidebarFamily.map(n => n)
            setUsingSidebar(true);
        }


        if (families.length === 0) {

            setLinks([]);
            setNodes([]);
            setRenderedNodes(new Set());
            setClickedNodes([]);
            return;
        } 



        const graphNodes = families.map((person, index) => (
            person.id === null ? {
                id: person.fid+'-',
                name: `${person.name} ${person.lastname}`,
                type: 'family',
                x: 0,
                y: 0,
                color: 'lightgreen',
                fx : 0 + (index * 200),
                fy : -50,
                fid: person.fid,
                gen: 0,
                tree: person.fid+'-'
            } : {
                id: person.id,
                name: `${person.name} ${person.lastname}`,
                type: 'person',
                x: 0,
                y: 0,
                color: 'lightblue',
                fx : 0 + (index * 200),
                fy : -50,
                fid: person.fid,
                gen: 0,
                tree: person.id
            }
        )).filter(node => node.id !== null);

        if (sidebarFamily) {
            setLinks([])
            setNodes(graphNodes);
            setClickedNodes([]);
            setRenderedNodes(new Set(graphNodes.map(node => node.id)));
        } else {
            if (usingSidebar) {
                setLinks([])
                setNodes(graphNodes);
                setClickedNodes([]);
                setRenderedNodes(new Set(graphNodes.map(node => node.id)));
                setUsingSidebar(false);
            } else {
                let chosen_trees = graphNodes.map(node => node.tree);
                let newNodes = graphNodes.filter(n => !nodes.map(n => n.id).includes(n.id));

                setRenderedNodes(new Set([...renderedNodes, ...newNodes.map(n => n.id)]));

                setNodes(nodes.filter(n => chosen_trees.includes(n.tree)).concat(newNodes));
                setLinks(links.filter(l => chosen_trees.includes(l.tree)));
            }
        }

    }, [selectedFamilies, sidebarFamily]);

    
    useEffect(() => {
        if (sidebarFamily && links.length === 0 && nodes.length === 1 && renderedNodes.size === 1) {
            handleNodeDoubleClick(nodes[0]);
        }
    }, [links, nodes]);



    const handleNodeClick = node => {
        if (!clickTimeout) {
            clickTimeout = setTimeout(() => {

                if (clickedNodes.includes(node.id)) {
                    let currentNodes = nodes;
                    let currentLinks = links;
                    let currentClickedNodes = clickedNodes;

                    let queuedNodes = [node];

                    

                    while (queuedNodes.length > 0) {
                        const currentNode = queuedNodes.pop();


                        currentClickedNodes = currentClickedNodes.filter(n => n !== currentNode.id);

                        queuedNodes = queuedNodes.concat(currentNodes.filter(n => n.referenced === currentNode.id));

                        let familyNodes = currentNodes.filter(n => selectedFamilies.map(f => f.fid+'-').includes(n.id)).map(n => n.id);



                        currentNodes = currentNodes.filter(n => n.referenced !== currentNode.id || familyNodes.includes(n.id));
                        if (currentNode.id !== node.id) {
                            if (!familyNodes.includes(currentNode.id)) {
                                renderedNodes.delete(currentNode.id);
                            }
                            currentLinks = currentLinks.filter(l => l.source.id !== currentNode.id && l.target.id !== currentNode.id);
                        } else {
                            currentLinks = currentLinks.filter(l => l.source.id !== currentNode.id);
                        }


                    }
                    setClickedNodes(currentClickedNodes);
                    setNodes(currentNodes);
                    setLinks(currentLinks);

                    // removedNodes.forEach(n => {renderedNodes.delete(n)});
                    setRenderedNodes(new Set(renderedNodes));

                } else {
                    const graphInfo = getImmidiateFamily(node, links);

                    const newNodes = graphInfo[0];
                    const newLinks = graphInfo[1];

                    setNodes([...nodes, ...newNodes]);
                    setLinks([...links, ...newLinks]);
                    setClickedNodes([...clickedNodes, node.id]);
                    setRenderedNodes(new Set(renderedNodes));

                }
                clickTimeout = null;
            }, 200);
        } else {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            handleNodeDoubleClick(node);
        }
    };

    const getImmidiateFamily = (node, current_links) => {
        const centerX = node.fx;
        const centerY = node.fy;

        const spouseOffsetX = 50;
        const childOffsetX = 50;

        const parentOffsetY = -25;

        const newNodes = [];
        const newLinks = [];

        const person = node.type === 'person' ? peopleData.find(person => person.id === node.id) :
            peopleData.find(person => person.fid == (node.id.replace('-', '')) && person.id === null);
        if (person) {
            const personId = node.id


            if (person.spouse) {
                person.spouse.forEach((spouseId, index) => {
                    if (!renderedNodes.has(spouseId)) {
                        const spouse = peopleData.find(p => p.id === spouseId);

                        if (spouse) {
                            newNodes.push({
                                id: spouse.id,
                                name: `${spouse.name} ${spouse.lastname}`,
                                type: 'person',
                                color: 'lightblue',
                                x: centerX,
                                y: centerY,
                                referenced: personId,
                                fx: centerX + ((index % 2 ? 1 : -1) * ((Math.floor(index / 2) + 1) * spouseOffsetX)),
                                fy: centerY,
                                fid: spouse.fid,
                                gen: node.gen,
                                tree: node.tree
                            });
                            

                            newLinks.push({ source: personId, target: spouse.id, color: 'pink', tree: node.tree });
                            renderedNodes.add(spouseId);
                        }
                    } else {
                        newLinks.push({ source: personId, target: spouseId, color: 'pink', tree: node.tree });
                    }
                });
            }


            if (person.children) {
                person.children.forEach((childId, index) => {
                    if (!renderedNodes.has(childId)) {
                        const child = peopleData.find(p => p.id === childId);
                        if (child) {
                            newNodes.push({
                                id: child.id,
                                name: `${child.name} ${child.lastname}`,
                                type: 'person',
                                color: 'lightblue',
                                x: centerX,
                                y: centerY,
                                referenced: personId,
                                fx: centerX + (person.children.length > 1 ? (((index) % 2 ? -1 : 1) * ((Math.floor((index) / 2) + 1) * (childOffsetX * ((node.gen % 2) + 1)))) : 0),
                                fy: centerY + 75,
                                fid: child.fid,
                                gen: node.gen + 1,
                                tree: node.tree
                            });
                            newLinks.push({ source: personId, target: child.id, color: 'blue', tree: node.tree });
                            renderedNodes.add(childId);
                        }
                    } else {
                        newLinks.push({ source: personId, target: childId, color: 'blue', tree: node.tree });
                    }
                });
            }

            const father = person.father !== null ? peopleData.find(p => p.id === person.father) : node.type === 'person' ?
                peopleData.find(p => p.fid === person.fid && p.id === null && p.children.includes(person.id)) : null;


            const fatherId = !father ? null : (father.id === null ?  father.fid+'-' :father.id);


            if (father && !renderedNodes.has(fatherId)) {

                const type = father.id === null ? 'family' : 'person';
                const color = father.id === null ? 'lightgreen' : 'lightblue';

                if (father) {
                    newNodes.push({
                        id: fatherId,
                        name: `${father.name} ${father.lastname}`,
                        type: type,
                        color: color,
                        x: centerX,
                        y: centerY,
                        referenced: personId,
                        fx: centerX - 25,
                        fy: centerY + parentOffsetY,
                        fid: father.fid,
                        gen: node.gen - 1,
                        tree: node.tree
                    });
                    newLinks.push({ source: personId, target: fatherId, color: 'green', tree: node.tree});
                    renderedNodes.add(fatherId);
                }
            } else if (renderedNodes.has(fatherId)) {
                if (!current_links.find(l => l.source.id === fatherId && l.target.id === person.id)) {
                    newLinks.push({ source: personId, target: fatherId, color: 'green', tree: node.tree });
                }
            }

            const mother = person.mother !== null ? peopleData.find(p => p.id === person.mother) : node.type === 'person' ?
                peopleData.find(p => p.fid === person.fid && p.id === null && p.children.includes(person.id)) : null;

            const motherId = !mother ? null : (mother.id === null ?  mother.fid+'-' : mother.id);

            if (mother && !renderedNodes.has(motherId)) {
                const type = mother.id === null ? 'family' : 'person';
                const color = mother.id === null ? 'lightgreen' : 'lightblue';

                if (mother) {
                    newNodes.push({
                        id: motherId,
                        name: `${mother.name} ${mother.lastname}`,
                        type: type,
                        color: color,
                        x: centerX,
                        y: centerY,
                        referenced: personId,
                        fx: centerX + 25,
                        fy: centerY + parentOffsetY,
                        fid: mother.fid,
                        gen: node.gen - 1,
                        tree: node.tree
                    });
                    newLinks.push({ source: personId, target: motherId, color: 'orange', tree: node.tree });
                    renderedNodes.add(motherId);
                }
            } else if (renderedNodes.has(motherId)) {
                console.log("here")
                current_links.forEach(l => console.log(l))
                console.log()
                if (!current_links.find(l => l.source.id === motherId && l.target.id === person.id)) {
                    newLinks.push({ source: personId, target: motherId, color: 'orange', tree: node.tree });
                } else {
                    console.log("here2")
                }
            }
        }

        return [newNodes, newLinks];
    };

    const handleNodeDoubleClick = (node) => {

        if (!clickedNodes.includes(node.id)) {
            const next_nodes = [node];
            const allNewNodes = [];
            const allNewLinks = [];
            while (next_nodes.length > 0) {
                const current_node = next_nodes.shift();
                clickedNodes.push(current_node.id);

                const graphInfo = getImmidiateFamily(current_node, allNewLinks);
                const newNodes = graphInfo[0];
                const newLinks = graphInfo[1];

                newNodes.forEach(n => {allNewNodes.push(n)});
                newLinks.forEach(l => {allNewLinks.push(l)});
                newNodes.forEach(n => {n.fid === node.fid ? next_nodes.push(n) : null});
            }
            setNodes([...nodes, ...allNewNodes]);
            setLinks([...links, ...allNewLinks]);
            setClickedNodes(clickedNodes);
            setRenderedNodes(new Set(renderedNodes));
        }
    };

    return (
        <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={{ nodes, links }}
            nodeAutoColorBy="group"
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onNodeDragEnd={handleNodeLeave}
            nodeLabel={() => ''}
            nodePointerAreaPaint={(node, color, ctx) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI, false); // Increase the radius for a larger clickable area
                ctx.fill();
            }}
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const isHovered = node.id === (hoveredNode && hoveredNode.id);
                const fontSize = isHovered ? 14 / globalScale : 11 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const padding = isHovered ? 4 : 2;
                const bckgDimensions = [textWidth + padding * 2, fontSize + padding * 2];
                const borderRadius = 8 / globalScale;

                ctx.beginPath();
                ctx.moveTo(node.x - bckgDimensions[0] / 2 + borderRadius, node.y - bckgDimensions[1] / 2);
                ctx.lineTo(node.x + bckgDimensions[0] / 2 - borderRadius, node.y - bckgDimensions[1] / 2);
                ctx.arcTo(node.x + bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, node.x + bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 + borderRadius, borderRadius);
                ctx.lineTo(node.x + bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2 - borderRadius);
                ctx.arcTo(node.x + bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2, node.x + bckgDimensions[0] / 2 - borderRadius, node.y + bckgDimensions[1] / 2, borderRadius);
                ctx.lineTo(node.x - bckgDimensions[0] / 2 + borderRadius, node.y + bckgDimensions[1] / 2);
                ctx.arcTo(node.x - bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2, node.x - bckgDimensions[0] / 2, node.y + bckgDimensions[1] / 2 - borderRadius, borderRadius);
                ctx.lineTo(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 + borderRadius);
                ctx.arcTo(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, node.x - bckgDimensions[0] / 2 + borderRadius, node.y - bckgDimensions[1] / 2, borderRadius);
                ctx.closePath();
                ctx.fillStyle = isHovered ? "rgba(0, 0, 255, 0.6)" : node.color;
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                ctx.stroke();

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'black';
                ctx.fillText(label, node.x, node.y);
            }}
        />
    );
};


export default FamilyGraph;
