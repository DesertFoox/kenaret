export const updateObject = (state, object) => {
  return {
    ...state,
    ...object,
  };
};

export default updateObject;
