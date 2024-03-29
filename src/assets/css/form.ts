import { css, DefaultTheme } from 'styled-components'

export type TextAlign = 'center' | 'left' | 'right'

export const formFieldStyles = ($textAlign: TextAlign) => css`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.color.gray1};
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.color.white};

  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-align: ${$textAlign || 'center'};

  &::placeholder {
    color: ${({ theme }) => theme.color.gray1};
    font-size: ${({ theme }) => theme.fontSize.base};
  }

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.color.primary.main};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.color.gray0};
    border: 1px solid ${({ theme }) => theme.color.gray0};
    color: ${({ theme }) => theme.color.gray1};
    cursor: default;
  }

  @media (max-width: 780px) {
    font-size: ${({ theme }) => theme.fontSize.sm};

    &::placeholder {
      font-size: ${({ theme }) => theme.fontSize.sm};
    }
  }
`

export const formFieldViewModeStyles = (
  theme: DefaultTheme,
  $viewMode: boolean
) => css`
  &:disabled {
    background-color: ${$viewMode
      ? theme.color.secondary.main
      : theme.color.gray0};
    border: 1px solid
      ${$viewMode ? theme.color.secondary.main : theme.color.gray0};
    color: ${$viewMode ? theme.color.black : theme.color.gray1};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }
`
