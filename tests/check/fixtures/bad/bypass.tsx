// expect: no-native-elements@10, no-native-elements@11, no-native-elements@12, no-native-elements@13, no-native-elements@14
// expect: no-component-classname-style@15, no-invalid-prop-value@15, no-native-elements@16, no-native-elements@17, no-component-classname-style@18, no-component-classname-style@20
import React, { createElement } from 'react';
import styled from 'styled-components';
import { Button } from 'sloyka';
import * as S from 'sloyka';

const T = 'div';
const X = Button;
export const A = () => React.createElement('section', null);
export const B = () => createElement('p');
export const C = () => jsx('span', {});
export const D = () => <T />;
export const E = () => <svg:rect />;
export const F = () => <X className="a" variant="huge" />;
const G = styled.div`color: red;`;
const H = styled('h1')`color: red;`;
const I = styled(Button)`color: red;`;
const J = S.Button;
export const K = () => <J style={{}} />;
