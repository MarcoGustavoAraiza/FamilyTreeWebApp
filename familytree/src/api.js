export const fetchAllFamilyNames = async () => {
    const response = await fetch('http://localhost:5000/api/all-family-names');
    const data = await response.json();
    return data;
};

export const fetchPeople = async () => {
    const response = await fetch('http://localhost:5000/api/people');
    const data = await response.json();
    return data;
};