import React, { useState, useRef, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'

import QuestionHelper from '../QuestionHelper'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

// import { darken } from 'polished'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh'
}

enum DeadlineError {
  InvalidInput = 'InvalidInput'
}

const FancyButton = styled.button`
  color: ${({ theme }) => theme.text1};
  align-items: center;
  height: 2rem;
  border-radius: 36px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid ${({ theme }) => theme.bg6};
  outline: none;
  background: none;
  :hover {
    border: 1px solid ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.primary1)};
  }
`

const Option = styled(FancyButton)<{ active: boolean }>`
  margin-right: 8px;
  :hover {
    cursor: pointer;
  }
  ${({ active, theme }) => active && `border-color: ${theme.text6}`};
  background-color: ${({ active, theme }) => active && theme.primary1};
  color: ${({ active, theme }) => (active ? theme.white : theme.text2)};
`

const Input = styled.input`
  background: none;
  font-size: 16px;
  width: auto;
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === 'red' ? theme.red1 : theme.text2)};
  text-align: right;
`

const OptionCustom = styled(FancyButton)<{ active?: boolean; warning?: boolean }>`
  height: 2rem;
  position: relative;
  padding: 0 0.75rem;
  flex: 1;
  border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1}`};
  :hover {
    border: ${({ theme, active, warning }) => active && `1px solid ${warning ? theme.red1 : theme.primary1}`};
  }
  input {
    width: 100%;
    height: 100%;
    border: 0px;
    border-radius: 2rem;
  }
`

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const inputRef = useRef<HTMLInputElement>()

  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch {}
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch {}
  }

  return (
    <AutoColumn gap="16px">
      <AutoColumn gap="16px">
        <RowFixed>
          <TYPE.black fontWeight={400} fontSize={14} color={theme.text4}>
            {t('tolerance')}
          </TYPE.black>
          <QuestionHelper color={theme.text4} text={t('hint1')} />
        </RowFixed>
        <RowBetween>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(10)
            }}
            active={rawSlippage === 10}
          >
            0.1%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(50)
            }}
            active={rawSlippage === 50}
          >
            0.5%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput('')
              setRawSlippage(100)
            }}
            active={rawSlippage === 100}
          >
            1%
          </Option>
          <OptionCustom active={![10, 50, 100].includes(rawSlippage)} warning={!slippageInputIsValid} tabIndex={-1}>
            <RowBetween>
              {!!slippageInput &&
              (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
                <SlippageEmojiContainer>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>
                </SlippageEmojiContainer>
              ) : null}
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <Input
                ref={inputRef as any}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((rawSlippage / 100).toFixed(2))
                }}
                onChange={e => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? 'red' : ''}
              />
              %
            </RowBetween>
          </OptionCustom>
        </RowBetween>
        {!!slippageError && (
          <RowBetween
            style={{
              fontSize: '14px',
              marginTop: '-8px',
              color: slippageError === SlippageError.InvalidInput ? theme.red1 : theme.text4
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? t('err1')
              : slippageError === SlippageError.RiskyLow
              ? t('err2')
              : t('err3')}
          </RowBetween>
        )}
      </AutoColumn>

      <AutoColumn gap="sm">
        <RowFixed>
          <TYPE.black fontSize={14} fontWeight={400} color={theme.text4}>
            {t('deadline')}
          </TYPE.black>
          <QuestionHelper color={theme.text4} text={t('hint2')} />
        </RowFixed>
        <RowFixed>
          <OptionCustom style={{ width: '80px' }} tabIndex={-1}>
            <Input
              color={!!deadlineError ? 'red' : undefined}
              onBlur={() => {
                parseCustomDeadline((deadline / 60).toString())
              }}
              placeholder={(deadline / 60).toString()}
              value={deadlineInput}
              onChange={e => parseCustomDeadline(e.target.value)}
            />
          </OptionCustom>
          <TYPE.body style={{ paddingLeft: '8px' }} color={theme.text3} fontSize={14}>
            {t('minutes')}
          </TYPE.body>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  )
}
