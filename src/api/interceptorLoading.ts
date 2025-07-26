export const interceptorLoading = (loading: boolean): void => {
  const loadingElements = document.querySelectorAll('.loading');
  for (let i = 0; i < loadingElements.length; i++) {
    const element = loadingElements[i] as HTMLElement;

    if (loading) {
      console.log('Loading state is true');
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
    } else {
      element.style.opacity = 'initial';
      element.style.pointerEvents = 'initial';
    }
  }
}
