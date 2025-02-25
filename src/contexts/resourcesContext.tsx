import React from "react";
interface IResourcesContext {
  isLoadingResources: boolean;
}

const defaultValue: IResourcesContext = {
  isLoadingResources: false,
};

const ResourcesContext = React.createContext<IResourcesContext>(defaultValue);

export default ResourcesContext;
