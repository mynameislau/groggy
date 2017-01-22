


export {
  init: (store) =>
    Object.create({
      createDefaultGrid: () => store.dispatch(createGrid(rogueMap));
    });
}
