import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { RowFixed } from '../Row'

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  color: ${({ theme }) => theme.text3};
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.text1};
  }
`

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text fontSize={14} fontWeight={500}>
        {ascending ? '↑' : '↓'}
      </Text>
    </FilterWrapper>
  )
}
