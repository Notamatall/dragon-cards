import React from "react";
interface IResourcesContext {
  isLoadingResources: boolean;
  loadingProgress: number;
}

const defaultValue: IResourcesContext = {
  isLoadingResources: false,
  loadingProgress: 0,
};

const ResourcesContext = React.createContext<IResourcesContext>(defaultValue);

export default ResourcesContext;
