export const fetchAllFamilyNames = async () => {
    const response = await fetch('http://3.129.127.64/api/all-family-names');
    const data = await response.json();
    return data;
};

export const fetchPeople = async () => {
    const response = await fetch('http://3.129.127.64/api/people');
    const data = await response.json();
    return data;
};