import { useState, useRef, useEffect } from 'react';
import styles from './GroupSelector.module.css';
import { ChevronDown } from 'lucide-react';

export default function GroupSelector({ groups, selectedGroupId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);
  
  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectorRef]);

  return (
    <div className={styles.selector} ref={selectorRef}>
      <button type="button" className={styles.selectorButton} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedGroup ? selectedGroup.name : 'Selecione um grupo'}</span>
        <ChevronDown size={20} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </button>
      {isOpen && (
        <ul className={styles.dropdown}>
          {groups.map(group => (
            <li 
              key={group.id} 
              className={styles.dropdownItem}
              onClick={() => {
                onSelect(group.id);
                setIsOpen(false);
              }}
            >
              {group.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}