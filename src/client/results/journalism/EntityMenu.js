import React from 'react';

const EntityMenu = ({ entities, selectedEntity, onClickSelectEntityTab }) => (
  <div className="ui secondary pointing labeled icon menu">
    {
      entities.map(entity => (
        <a
          key={`entity${entity.id}`}
          className={`item ${selectedEntity === parseInt(entity.id, 10) && 'active'}`}
          onClick={() => onClickSelectEntityTab(parseInt(entity.id, 10))}
        >
          {
            entity.crestUrl ?
              <img className="ui mini image" src={entity.crestUrl} />
            :
              <i className="big icons">
                <i className="user icon"></i>
                <i className="corner purple soccer icon"></i>
              </i>
          }
          {entity.name}
        </a>
      ))
    }
  </div>
);

export default EntityMenu;
